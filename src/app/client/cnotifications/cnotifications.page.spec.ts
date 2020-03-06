import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnotificationsPage } from './cnotifications.page';

describe('CnotificationsPage', () => {
  let component: CnotificationsPage;
  let fixture: ComponentFixture<CnotificationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnotificationsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnotificationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
