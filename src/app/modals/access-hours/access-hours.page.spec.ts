import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessHoursPage } from './access-hours.page';

describe('AccessHoursPage', () => {
  let component: AccessHoursPage;
  let fixture: ComponentFixture<AccessHoursPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessHoursPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessHoursPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
