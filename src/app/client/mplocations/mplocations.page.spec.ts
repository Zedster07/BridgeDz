import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MplocationsPage } from './mplocations.page';

describe('MplocationsPage', () => {
  let component: MplocationsPage;
  let fixture: ComponentFixture<MplocationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MplocationsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MplocationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
