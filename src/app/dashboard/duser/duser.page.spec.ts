import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuserPage } from './duser.page';

describe('DuserPage', () => {
  let component: DuserPage;
  let fixture: ComponentFixture<DuserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
