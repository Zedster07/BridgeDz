import { Component, OnInit } from '@angular/core';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { ModalController } from '@ionic/angular';
import { StartLocAgencyPage } from 'src/app/modals/start-loc-agency/start-loc-agency.page';
import { GlobalsService } from 'src/app/services/globals.service';
import { UtilService } from 'src/app/services/util.service';
import { BookingOutPage } from 'src/app/modals/booking-out/booking-out.page'

@Component({
  selector: 'app-renting',
  templateUrl: './renting.page.html',
  styleUrls: ['./renting.page.scss'],
})
export class RentingPage implements OnInit {

  mylocations = [];

  constructor(
     private glb: GlobalsService,
     private db: DbinteractionsService,
     private modalController: ModalController,
     public util: UtilService,
     ) {

   }

   async ngOnInit() {}

  getFrontPic(car: any) {
    const piclist = car['picturesList'];
    return this.glb.hostServer + piclist.substring( 0 , piclist.indexOf(','));
  }

  
  async startL(index) {
    const modal = await this.modalController.create({
      component: StartLocAgencyPage,
      backdropDismiss: true,
      componentProps: {
        data: this.mylocations[index]
      }
    });
    return await modal.present();
  }

  async createBooking(){
    const modal = await this.modalController.create({
      component: BookingOutPage,
      backdropDismiss: false,
      componentProps: {
        type: '',
        actionType: '0',
        id: this.glb.AgencyLogData.id
      }
    });
    return await modal.present();
  }

  async ionViewWillEnter() {
    const res = await this.db.getMELocs();
    if (res['status'] === 'success') {
      this.mylocations = res['data'];
      console.log(res['data']);
      for (let i= 0; i<this.mylocations.length; i++){
        if(this.util.ifSameDay(this.mylocations[i]['startDate'], new Date())){
          this.mylocations[i]['startRenting'] = '1';
        } else {
          this.mylocations[i]['startRenting'] = '0';
        }
      }
    }

  }
}
