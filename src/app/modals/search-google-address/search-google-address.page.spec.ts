import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
 import { async, ComponentFixture, TestBed } from '@angular/core/testing';

 import { SearchGoogleAddressPage } from './search-google-address.page';

 describe('SearchGoogleAddressPage', () => {
   let component: SearchGoogleAddressPage;
   let fixture: ComponentFixture<SearchGoogleAddressPage>;

   beforeEach(async(() => {
     TestBed.configureTestingModule({
       declarations: [ SearchGoogleAddressPage ],
       schemas: [CUSTOM_ELEMENTS_SCHEMA],
     })
     .compileComponents();
   }));

   beforeEach(() => {
     fixture = TestBed.createComponent(SearchGoogleAddressPage);
     component = fixture.componentInstance;
     fixture.detectChanges();
   });

   it('should create', () => {
     expect(component).toBeTruthy();
   });
 });