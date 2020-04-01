import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdetagencyPage } from './ddetagency.page';

describe('DdetagencyPage', () => {
  let component: DdetagencyPage;
  let fixture: ComponentFixture<DdetagencyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdetagencyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdetagencyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
