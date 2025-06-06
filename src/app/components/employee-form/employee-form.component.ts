import { DepartmentList } from './../../models/companyDepartment';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { INotification } from '../../models/notification';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company';
import { CompanyAreaService } from '../../services/company-area.service';
import { CompanyAreaList } from '../../models/companyArea';
import { CompanyDepartmentService } from '../../services/company-department.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent implements OnInit {
  private employeeId: number | null = null;

  companies: Company[] = [];
  areas: CompanyAreaList[] = [];
  departments: DepartmentList[] = [];

  companySelected: number = 0;
  areaSelected: number = 0;
  departmentSelected: number = 0;

  employeeForm!: FormGroup;
  selectedProfileImageFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;

  isEditMode: boolean = false;
  isActive: boolean = true;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private areaService: CompanyAreaService,
    private departmentService: CompanyDepartmentService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      id: [0],
      fullName: ['', Validators.required],
      company_id: ['', Validators.required],
      company_area_id: ['', [Validators.required]],
      company_department_id: ['', Validators.required],
      position: ['', Validators.required],
      startDate: ['', Validators.required],
      status: ['1', Validators.required],
      photo: [''],
    });

    this.route.paramMap.subscribe((params) => {
      const idParam: number = Number(params.get('id'));
      this.loadCompanies();

      if (idParam) {
        this.isEditMode = true;
        this.employeeId = idParam;
        this.loadEmployee(this.employeeId);
      } else {
        this.isEditMode = false;
        const today = new Date();
        const formattedToday = today.toISOString().substring(0, 10);
        this.employeeForm.patchValue({ startDate: formattedToday });
      }
    });

    this.employeeForm.get('company_id')?.valueChanges.subscribe((companyId) => {
      this.areas = [];
      this.departments = [];
      this.loadCompanyAreas(companyId);
    });

    this.employeeForm
      .get('company_area_id')
      ?.valueChanges.subscribe((companyAreaId) => {
        this.departments = [];
        this.loadCompanyDepartments(companyAreaId);
      });
  }

  loadCompanies() {
    this.companyService.getCompanies().subscribe({
      next: (result) => {
        this.companies = result;
      },
    });
  }

  loadCompanyAreas(company_id: number) {
    this.areaService.getAreas(company_id).subscribe({
      next: (result) => {
        this.areas = result;
      },
    });
  }

  loadCompanyDepartments(company_department_id: number) {
    this.departmentService.getDepartments(company_department_id).subscribe({
      next: (result) => {
        this.departments = result;
      },
    });
  }

  eventCheck(event: any) {
    const checkbox = event.target.checked;

    this.employeeForm.patchValue({
      status: checkbox == true ? '1' : '0',
    });
  }

  loadEmployee(id: number): void {
    this.employeeService.getEmployeeById(id).subscribe(
      (employee: Employee | undefined) => {
        if (employee) {
          this.isActive = employee.status == '1' ? true : false;

          this.employeeForm.patchValue({
            id: employee.id,
            fullName: employee.fullName,
            company_id: employee.company_id,
            company_area_id: employee.company_area_id,
            company_department_id: employee.company_department_id,
            position: employee.position,
            startDate: employee.startDate,
            status: employee.status,
            photo: employee.photo,
          });

          if (employee.photo) {
            this.imagePreviewUrl = employee.photo;
          }
        } else {
          this.router.navigate(['/employees']);
          this.toastService.warning('Empleado no encontrado', 'Advertensia');
        }
      },
      (error) => {
        this.router.navigate(['/employees']);
        this.toastService.error('Error al cargar el empleado', 'Error');
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.isDefaultNamespace.length > 0) {
      this.selectedProfileImageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedProfileImageFile);
    } else {
      this.selectedProfileImageFile = null;
      this.imagePreviewUrl = null;
    }
  }

  removeProfileImage(): void {
    this.selectedProfileImageFile = null;
    this.imagePreviewUrl = null;
    this.employeeForm.patchValue({ photo: '' });
  }

  saveEmployee(): void {
    if (this.employeeForm.invalid) {
      this.toastService.warning(
        'Formulario invalido. Por favor, revisa los campos.',
        'Advertensia'
      );
      this.employeeForm.markAllAsTouched();
      return;
    }

    const employeeData: Employee = this.employeeForm.value;

    if (employeeData.startDate) {
      employeeData.startDate = new Date(employeeData.startDate);
    }

    if (this.isEditMode && this.employeeId !== null) {
      employeeData.id = this.employeeId;

      this.employeeService
        .updateEmployee(employeeData, this.selectedProfileImageFile)
        .subscribe({
          next: (result: INotification) => {
            if (result.success) {
              this.router.navigate(['/employees']);
              this.toastService.success(result.msg, 'Exito');
            } else {
              this.toastService.error(result.msg, 'Error');
            }
          },
          error: (err) =>
            this.toastService.error('Error al actualizar al empleado', 'Error'),
        });
    } else {
      employeeData.id = 0;
      this.employeeService
        .addEmployee(employeeData, this.selectedProfileImageFile)
        .subscribe({
          next: (result: INotification) => {
            if (result.success) {
              this.router.navigate(['/employees']);
              this.toastService.success(result.msg, 'Exito');
            } else {
              this.toastService.error(result.msg, 'Error');
            }
          },
          error: (err) =>
            this.toastService.error('Error al crear al empleado', 'Exito'),
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }

  get f() {
    return this.employeeForm.controls;
  }
}
