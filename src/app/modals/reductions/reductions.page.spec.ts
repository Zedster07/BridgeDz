import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReductionsPage } from './reductions.page';

describe('ReductionsPage', () => {
  let component: ReductionsPage;
  let fixture: ComponentFixture<ReductionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReductionsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReductionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
