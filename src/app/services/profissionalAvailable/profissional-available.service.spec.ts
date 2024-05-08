import { TestBed } from '@angular/core/testing';

import { ProfissionalAvailableService } from './profissional-available.service';

describe('ProfissionalAvailableService', () => {
  let service: ProfissionalAvailableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfissionalAvailableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
