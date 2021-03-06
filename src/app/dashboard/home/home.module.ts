import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import { IonicModule } from '@ionic/angular';
//import { NgxGaugeModule } from 'ngx-gauge';
import { HomePage } from './home.page';
import {TranslateModule} from '@ngx-translate/core';
import { ChartsModule } from 'ng2-charts';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import localefr from '@angular/common/locales/fr';
import localeen from '@angular/common/locales/en';
import localear from '@angular/common/locales/ar';

registerLocaleData(localefr);
registerLocaleData(localeen);
registerLocaleData(localear);

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    ChartsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    //NgxGaugeModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
