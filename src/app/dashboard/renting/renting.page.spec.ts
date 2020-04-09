import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentingPage } from './renting.page';

describe('RentingPage', () => {
  let component: RentingPage;
  let fixture: ComponentFixture<RentingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
