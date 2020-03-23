import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DagencyPage } from './dagency.page';

describe('DagencyPage', () => {
  let component: DagencyPage;
  let fixture: ComponentFixture<DagencyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DagencyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DagencyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

