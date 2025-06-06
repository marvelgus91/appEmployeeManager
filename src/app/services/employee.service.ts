import { HttpClient } from '@angular/common/http';
import { Employee, EmployeeList } from './../models/employee';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { INotification } from '../models/notification';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  getEmployees(): Observable<EmployeeList[]> {
    const url = new URL(`${environment.apiUrl}/employees`);
    return this.http.get<EmployeeList[]>(url.toString());
  }

  getEmployeeById(id: number): Observable<Employee | undefined> {
    const url = new URL(`${environment.apiUrl}/employees/${id}`);
    return this.http.get<Employee>(url.toString());
  }

  addEmployee(
    employee: Employee,
    photo?: File | null
  ): Observable<INotification> {
    const url = new URL(`${environment.apiUrl}/employees`);
    const formData = new FormData();

    formData.append('fullName', employee.fullName);
    formData.append('company_id', employee.company_id.toString());
    formData.append('company_area_id', employee.company_area_id.toString());
    formData.append(
      'company_department_id',
      employee.company_department_id.toString()
    );
    formData.append('position', employee.position);
    formData.append(
      'startDate',
      employee.startDate.toISOString().split('T')[0]
    );
    formData.append('status', employee.status);

    if (photo) {
      formData.append('photo', photo, photo.name);
    }

    return this.http.post<INotification>(url.toString(), formData);
  }

  updateEmployee(
    employee: Employee,
    photo: File | null
  ): Observable<INotification> {
    const url = new URL(`${environment.apiUrl}/employees/update`);
    const formData = new FormData();

    formData.append('id', employee.id.toString());
    formData.append('fullName', employee.fullName);
    formData.append('company_id', employee.company_id.toString());
    formData.append('company_area_id', employee.company_area_id.toString());
    formData.append(
      'company_department_id',
      employee.company_department_id.toString()
    );
    formData.append('position', employee.position);
    formData.append(
      'startDate',
      employee.startDate.toISOString().split('T')[0]
    );
    formData.append('status', employee.status);

    if (photo) {
      formData.append('photo', photo, photo.name);
    }

    return this.http.post<INotification>(url.toString(), formData);
  }

  deleteEmployee(id: number): Observable<INotification> {
    const url = new URL(`${environment.apiUrl}/employees/delete/${id}`);

    return this.http.get<INotification>(url.toString());
  }
}
