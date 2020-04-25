import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
 import { async, ComponentFixture, TestBed } from '@angular/core/testing';

 import { StartLocAgencyPage } from './start-loc-agency.page';

 describe('StartLocAgencyPage', () => {
   let component: StartLocAgencyPage;
   let fixture: ComponentFixture<StartLocAgencyPage>;

   beforeEach(async(() => {
     TestBed.configureTestingModule({
       declarations: [ StartLocAgencyPage ],
       schemas: [CUSTOM_ELEMENTS_SCHEMA],
     })
     .compileComponents();
   }));

   beforeEach(() => {
     fixture = TestBed.createComponent(StartLocAgencyPage);
     component = fixture.componentInstance;
     fixture.detectChanges();
   });

   it('should create', () => {
     expect(component).toBeTruthy();
   });
 });