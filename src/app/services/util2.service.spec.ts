import { TestBed } from '@angular/core/testing';

import { Util2Service } from './util2.service';
import {TranslateModule} from '@ngx-translate/core';

describe('Util2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Util2Service = TestBed.get(Util2Service);
    expect(service).toBeTruthy();
  });
});
