import { TestBed } from '@angular/core/testing';

import { OdataServiceService } from './odata-service.service';

describe('OdataServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OdataServiceService = TestBed.get(OdataServiceService);
    expect(service).toBeTruthy();
  });
});
