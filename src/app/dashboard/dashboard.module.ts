import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DashboardPage } from './dashboard.page';
import { DashboardMenuListComponent } from './dashboard-menu-list/dashboard-menu-list.component';
import { LanguagePage } from '../language/language.page';
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children : [
      {
        path: '',
        redirectTo: 'home'
      },
      {
        path: 'profile',
        loadChildren: './profile/profile.module#ProfilePageModule'
      },
      {
        path: 'home',
        loadChildren: './home/home.module#HomePageModule'
      },
      {
        path: 'voitures',
        loadChildren: './voitures/voitures.module#VoituresPageModule'
      },
      {
        path: 'wallet',
        loadChildren: './wallet/wallet.module#WalletPageModule'
      },
      {
        path: 'locations',
        loadChildren: './locations/locations.module#LocationsPageModule'
      },
      {
        path: 'notifications',
        loadChildren: './notifications/notifications.module#NotificationsPageModule'
      },
      {
        path: 'demandeslocs',
        loadChildren: './demandeslocs/demandeslocs.module#DemandeslocsPageModule'
      },
      {
        path: 'validation-request',
        loadChildren: './validation-request/validation-request.module#ValidationRequestPageModule'
      },
      {
        path: 'brpage',
        loadChildren: './brpage/brpage.module#BrpagePageModule'
      },
      {
        path: 'dagency',
        loadChildren: './dagency/dagency.module#DagencyPageModule'
      },
      {
        path: 'duser',
        loadChildren: './duser/duser.module#DuserPageModule'
      },
      {
        path: 'renting',
        loadChildren: './renting/renting.module#RentingPageModule'
      },

    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
  ],
  entryComponents: [DashboardMenuListComponent],
  declarations: [DashboardPage , DashboardMenuListComponent]
})
export class DashboardPageModule {}
