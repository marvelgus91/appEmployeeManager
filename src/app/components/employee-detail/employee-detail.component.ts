import { EmployeeService } from './../../services/employee.service';
import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeList } from '../../models/employee';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.css',
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private EmployeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.getEmployeeDetails();
  }

  getEmployeeDetails(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.EmployeeService.getEmployeeById(id).subscribe(
        (employee: Employee | undefined) => {
          this.employee = employee;

          if (!employee) {
            console.warn(`Empleado con ID ${id} no encontrado.`);
          }
        },
        (error) => {
          console.error('Error al cargar los detalles del empleado: ', error);
        }
      );
    } else {
      console.warn('No se proporciono un ID de empleado en la URL.');
      this.router.navigate(['/employees']);
    }
  }

  editEmployee(): void {
    if (this.employee && this.employee.id) {
      this.router.navigate(['/employees/edit', this.employee.id]);
    } else {
      console.warn('No se puede editar: Empleado o ID no definido.');
    }
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }

  get dateFormat() {
    return this.employee!.startDate
      ? new Date(this.employee!.startDate).toISOString().substring(0, 10)
      : '';
  }
}
