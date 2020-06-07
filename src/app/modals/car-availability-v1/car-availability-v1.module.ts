import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { registerLocaleData } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import localefr from '@angular/common/locales/fr';
import localeen from '@angular/common/locales/en';
import localear from '@angular/common/locales/ar';

import { CarAvailabilityV1Page } from './car-availability-v1.page';

registerLocaleData(localefr);
registerLocaleData(localeen);
registerLocaleData(localear);


const routes: Routes = [
  {
    path: '',
    component: CarAvailabilityV1Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    
    RouterModule.forChild(routes)
  ],
  declarations: [CarAvailabilityV1Page]
})
export class CarAvailabilityV1PageModule {}
