import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeslocsPage } from './demandeslocs.page';

describe('DemandeslocsPage', () => {
  let component: DemandeslocsPage;
  let fixture: ComponentFixture<DemandeslocsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandeslocsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeslocsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
