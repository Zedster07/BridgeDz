import { TestBed } from '@angular/core/testing';

import { DbinteractionsService } from './dbinteractions.service';

describe('DbinteractionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DbinteractionsService = TestBed.get(DbinteractionsService);
    expect(service).toBeTruthy();
  });
});
