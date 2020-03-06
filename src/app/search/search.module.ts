import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { IonicTimepickerModule } from '@logisticinfotech/ionic-timepicker';
import { IonicModule } from '@ionic/angular';

import { SearchPage } from './search.page';
import { ClientMenuListComponent } from '../client/client-menu-list/client-menu-list.component';

const routes: Routes = [
  {
    path: '',
    component: SearchPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ionic4DatepickerModule,
    IonicTimepickerModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [],
  declarations: [SearchPage ]
})
export class SearchPageModule {}
