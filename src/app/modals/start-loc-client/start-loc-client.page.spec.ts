import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartLocClientPage } from './start-loc-client.page';

describe('StartLocClientPage', () => {
  let component: StartLocClientPage;
  let fixture: ComponentFixture<StartLocClientPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartLocClientPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartLocClientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
