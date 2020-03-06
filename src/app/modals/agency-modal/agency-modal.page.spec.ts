import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyModalPage } from './agency-modal.page';

describe('AgencyModalPage', () => {
  let component: AgencyModalPage;
  let fixture: ComponentFixture<AgencyModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
