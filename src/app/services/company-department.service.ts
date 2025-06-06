import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department, DepartmentList } from '../models/companyDepartment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompanyDepartmentService {
  constructor(private http: HttpClient) {}

  getDepartments(company_department_id: number): Observable<DepartmentList[]> {
    const url = new URL(
      `${environment.apiUrl}/company-department/byArea/${company_department_id}`
    );
    return this.http.get<DepartmentList[]>(url.toString());
  }
}
