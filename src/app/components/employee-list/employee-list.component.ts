import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeList } from './../../models/employee';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { ModalService } from '../../services/modal.service';
import { AppComponent } from '../../app.component';
import { INotification } from '../../models/notification';
import { Company } from '../../models/company';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent implements OnInit {
  employees: EmployeeList[] = [];
  filteredEmployees: EmployeeList[] = [];
  companies: Company[] = [];

  searchTerm: string = '';
  selectedCompany: string = '';

  constructor(
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private toastService: ToastService,
    private modalService: ModalService,
    private appComponent: AppComponent
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.getEmployees();
  }

  loadCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
      },
      error: (err) => {
        this.toastService.error(
          'Error al cargar la lista de empresas.',
          'Error'
        );
      },
    });
  }

  getEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.applyFilters();
      },
      error: (err) =>
        this.toastService.error(
          'Error al cargar la lista de empleados.',
          'Error'
        ),
    });
  }

  deleteEmployee(id: number): void {
    this.appComponent.showConfirmationModal(
      'Confirmar Eliminacion',
      'Esta seguro de que desea eliminar al empleado',
      'Eliminar',
      'btn-danger',
      'Cancelar'
    );

    this.modalService.confirm().subscribe((confirmed) => {
      if (confirmed) {
        this.employeeService.deleteEmployee(id).subscribe({
          next: (result: INotification) => {
            if (result.success) {
              this.getEmployees();
              this.toastService.success(result.msg, 'Exito');
            } else {
              this.toastService.error(result.msg, 'Error');
            }
          },
          error: (err) =>
            this.toastService.error(
              'Ocurrio un error inesperado al eliminar al empleado',
              'Exito'
            ),
        });
      } else {
        this.toastService.info(
          'Eliminacion de empleado cancelada.',
          'Informacion'
        );
      }
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onCompanyChange() {
    this.applyFilters();
  }

  applyFilters() {
    let tempEmployees = [...this.employees];

    if (this.selectedCompany != '') {
      tempEmployees = tempEmployees.filter(
        (employee) => employee.company === this.selectedCompany
      );
    }

    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const lowerCaseSearchTerm = this.searchTerm.trim().toLocaleLowerCase();
      tempEmployees = tempEmployees.filter(
        (employee) =>
          employee.fullName.toLocaleLowerCase().includes(lowerCaseSearchTerm) ||
          employee.position.toLocaleLowerCase().includes(lowerCaseSearchTerm) ||
          employee.area.toLocaleLowerCase().includes(lowerCaseSearchTerm) ||
          employee.department.toLocaleLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    this.filteredEmployees = tempEmployees;
  }
}
