import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoituresPage } from './voitures.page';

describe('VoituresPage', () => {
  let component: VoituresPage;
  let fixture: ComponentFixture<VoituresPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoituresPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoituresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
