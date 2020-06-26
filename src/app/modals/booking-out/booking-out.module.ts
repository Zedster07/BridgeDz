import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { BookingOutPage } from './booking-out.page';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


const routes: Routes = [
  {
    path: '',
    component: BookingOutPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    NgbModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BookingOutPage],

})
export class BookingOutPageModule {}
