import { TestBed } from '@angular/core/testing';

import { CompanyAreaService } from './company-area.service';

describe('CompanyAreaService', () => {
  let service: CompanyAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
