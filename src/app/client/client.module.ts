import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { LanguagePage } from '../language/language.page';
import { ClientPage } from './client.page';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { IonicTimepickerModule } from '@logisticinfotech/ionic-timepicker';
import { ClientMenuListComponent } from './client-menu-list/client-menu-list.component';
const routes: Routes = [
  
  {
    path: '',
    component: ClientPage,
    children : [
      {
        path: '',
        redirectTo: 'accueil'
      },
      {
        path: 'accueil',
        loadChildren: './accueil/accueil.module#AccueilPageModule'
      },
      {
        path: 'mplocations',
        loadChildren: './mplocations/mplocations.module#MplocationsPageModule'
      },
      {
        path: 'historique',
        loadChildren: './historique/historique.module#HistoriquePageModule'
      },
      {
        path: 'cnotifications',
        loadChildren: './cnotifications/cnotifications.module#CnotificationsPageModule'
      },
      {
        path: 'monprofile',
        loadChildren: './monprofile/monprofile.module#MonprofilePageModule'
      }
    ]
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
  declarations: [ClientPage]
})
export class ClientPageModule {}
