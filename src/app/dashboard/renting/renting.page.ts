import { Component, OnInit } from '@angular/core';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { ModalController } from '@ionic/angular';
import { StartLocAgencyPage } from 'src/app/modals/start-loc-agency/start-loc-agency.page';
import { GlobalsService } from 'src/app/services/globals.service';
import { UtilService } from 'src/app/services/util.service';
import { BookingOutPage } from 'src/app/modals/booking-out/booking-out.page'
import { booking_state } from 'src/app/interfaces/booking_state';

@Component({
  selector: 'app-renting',
  templateUrl: './renting.page.html',
  styleUrls: ['./renting.page.scss'],
})
export class RentingPage implements OnInit {

  mylocations = [];

  constructor(
     public glb: GlobalsService,
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

  generateBilling(i){
  }
  async startL(index) {
    const modal = await this.modalController.create({
      component: StartLocAgencyPage,
      backdropDismiss: true,
      componentProps: {
        data: this.mylocations[index],
        type_book : 1,
        inv_step : 0
      }
    });
    return await modal.present();
  }

  async endL(index) {
    const modal = await this.modalController.create({
      component: StartLocAgencyPage,
      backdropDismiss: false,
      componentProps: {
        data: this.mylocations[index],
        type_book : 1,
        inv_step : 1

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

    modal.onDidDismiss().then((result) => {
      if(this.util.ifSameDay(result['data']['res']['startDate'], new Date())){
        result['data']['res']['startRenting'] = '1';
      } else {
        result['data']['res']['startRenting'] = '0';
      }
      this.mylocations.push(result['data']['res']);
    });

    const vari = await modal.present();
  
  }

  async cancelBooking(i){
    const res = await this.db.cancelBookingOut(this.mylocations[i]['bid'], this.mylocations[i]['guid_book'], booking_state.cancel_by_Agency);
    if (res['status'] === 'success') {
      this.mylocations[i]['booking_state'] = booking_state.cancel_by_Agency;
      console.log(this.mylocations[i]);
    }  
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
        if(this.util.ifSameDay(this.mylocations[i]['endDate'], new Date())){
          this.mylocations[i]['endRenting'] = '1';
        } else {
          this.mylocations[i]['endRenting'] = '0';
        }
      }
    }

  }
}
