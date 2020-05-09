import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationRequestPage } from './validation-request.page';

describe('ValidationRequestPage', () => {
  let component: ValidationRequestPage;
  let fixture: ComponentFixture<ValidationRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationRequestPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
