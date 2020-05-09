import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingOutPage } from './booking-out.page';

describe('BookingOutPage', () => {
  let component: BookingOutPage;
  let fixture: ComponentFixture<BookingOutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingOutPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingOutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
