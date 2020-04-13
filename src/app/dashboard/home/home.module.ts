import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
//import { NgxGaugeModule } from 'ngx-gauge';
import { HomePage } from './home.page';
import {TranslateModule} from '@ngx-translate/core';
import { ChartsModule } from 'ng2-charts';

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
    //NgxGaugeModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
