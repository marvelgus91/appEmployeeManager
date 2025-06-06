import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyArea, CompanyAreaList } from '../models/companyArea';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompanyAreaService {
  constructor(private http: HttpClient) {}

  getAreas(company_id: number): Observable<CompanyAreaList[]> {
    const url = new URL(
      `${environment.apiUrl}/company-areas/byCompany/${company_id}`
    );
    return this.http.get<CompanyAreaList[]>(url.toString());
  }
}
