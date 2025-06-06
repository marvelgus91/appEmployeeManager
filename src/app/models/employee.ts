export interface EmployeeList {
  id: number;
  fullName: string;
  company: string;
  area: string;
  department: string;
  position: string;
  photo: string;
  startDate: string;
  status: string;
}

export interface Employee {
  id: number;
  fullName: string;
  company_id: number;
  company_area_id: number;
  company_department_id: number;
  position: string;
  photo: string;
  startDate: Date;
  status: string;
}
