import { TestBed } from '@angular/core/testing';

import { HttpgetService } from './httpget.service';

describe('HttpgetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpgetService = TestBed.get(HttpgetService);
    expect(service).toBeTruthy();
  });
});
