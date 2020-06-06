import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { AccueilPage } from './accueil.page';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { IonicTimepickerModule } from '@logisticinfotech/ionic-timepicker';

const routes: Routes = [
  {
    path: '',
    component: AccueilPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    Ionic4DatepickerModule,
    IonicTimepickerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AccueilPage]
})
export class AccueilPageModule {}
