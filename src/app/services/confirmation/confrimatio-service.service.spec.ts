import { TestBed } from '@angular/core/testing';

import { ConfrimatioServiceService } from './confirmation-service.service';

describe('ConfrimatioServiceService', () => {
  let service: ConfrimatioServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfrimatioServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
