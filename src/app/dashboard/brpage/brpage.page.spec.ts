import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrpagePage } from './brpage.page';

describe('BrpagePage', () => {
  let component: BrpagePage;
  let fixture: ComponentFixture<BrpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrpagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
