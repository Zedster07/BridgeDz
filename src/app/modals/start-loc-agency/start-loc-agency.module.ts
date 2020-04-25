import { NgModule } from '@angular/core';
 import { CommonModule } from '@angular/common';
 import { FormsModule } from '@angular/forms';
 import { Routes, RouterModule } from '@angular/router';

 import { IonicModule } from '@ionic/angular';

 import { StartLocAgencyPage } from './start-loc-agency.page';

 const routes: Routes = [
   {
     path: '',
     component: StartLocAgencyPage
   }
 ];

 @NgModule({
   imports: [
     CommonModule,
     FormsModule,
     IonicModule,
     RouterModule.forChild(routes)
   ],
   declarations: [StartLocAgencyPage]
 })
 export class StartLocAgencyPageModule {}