import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonprofilePage } from './monprofile.page';

describe('MonprofilePage', () => {
  let component: MonprofilePage;
  let fixture: ComponentFixture<MonprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonprofilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
