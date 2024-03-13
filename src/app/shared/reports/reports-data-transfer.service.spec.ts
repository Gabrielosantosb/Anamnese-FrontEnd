import { TestBed } from '@angular/core/testing';

import { ReportsDataTransferService } from './reports-data-transfer.service';

describe('ProductsDataTransferService', () => {
  let service: ReportsDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportsDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
