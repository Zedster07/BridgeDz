import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarAvailabilityV1Page } from './car-availability-v1.page';

describe('CarAvailabilityV1Page', () => {
  let component: CarAvailabilityV1Page;
  let fixture: ComponentFixture<CarAvailabilityV1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarAvailabilityV1Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarAvailabilityV1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
