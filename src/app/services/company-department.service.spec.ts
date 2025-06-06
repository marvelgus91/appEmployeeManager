import { TestBed } from '@angular/core/testing';

import { CompanyDepartmentService } from './company-department.service';

describe('CompanyDepartmentService', () => {
  let service: CompanyDepartmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyDepartmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
