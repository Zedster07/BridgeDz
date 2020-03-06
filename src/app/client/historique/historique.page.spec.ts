import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriquePage } from './historique.page';

describe('HistoriquePage', () => {
  let component: HistoriquePage;
  let fixture: ComponentFixture<HistoriquePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriquePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriquePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
