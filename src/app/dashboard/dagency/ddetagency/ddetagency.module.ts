import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DdetagencyPage } from './ddetagency.page';

const routes: Routes = [
  {
    path: '',
    component: DdetagencyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DdetagencyPage]
})
export class DdetagencyPageModule {}
