import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PwdPage } from './pwd.page';

describe('PwdPage', () => {
  let component: PwdPage;
  let fixture: ComponentFixture<PwdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PwdPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
