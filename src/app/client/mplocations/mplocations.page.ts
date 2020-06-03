import { Component, OnInit } from '@angular/core';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { UtilService } from 'src/app/services/util.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertService } from 'src/app/services/alert.service';
import { ReservePage } from 'src/app/modals/reserve/reserve.page';
import { booking_state } from 'src/app/interfaces/booking_state';
import { BillingService } from 'src/app/services/billing.service';
import { ModalController } from '@ionic/angular';
import { StartLocClientPage } from 'src/app/modals/start-loc-client/start-loc-client.page';
import { RatingPage } from 'src/app/modals/rating/rating.page';



@Component({
  selector: 'app-mplocations',
  templateUrl: './mplocations.page.html',
  styleUrls: ['./mplocations.page.scss'],
})
export class MplocationsPage implements OnInit {
    mylocations = [];

     constructor(
     private db: DbinteractionsService,
     private modalController: ModalController,
     public glb: GlobalsService,
     private bill: BillingService,
     public util: UtilService,
     public loading:LoadingService,
     public alert: AlertService
     ) {
  
  }

  ngOnInit() {
  }

  generateBilling(index){
    this.bill.generateClientBilling(this.mylocations[index]);
  }

  async cancelBooking(index){
    const res = await this.db.cancelBooking(this.mylocations[index]['bid'], this.mylocations[index]['guid_book'], booking_state.cancel_by_client);
    if(res['status'] === 'success'){
      this.alert.presentAlert('réservation annullée', 'votre réservation est annulée avec succés');
      this.mylocations[index]['bstatus'] = booking_state.cancel_by_client;
      //TODO
    }
  }

  
   

  async startL(index) {
    const modal = await this.modalController.create({
      component: StartLocClientPage,
      backdropDismiss: false,
      componentProps: {
        data: this.mylocations[index],
        inv_step : 0
      }
    });
    return await modal.present();
  }

  async note(index){
    console.log(this.mylocations[index]);
    const modal = await this.modalController.create({
      component: RatingPage,
      backdropDismiss: true,
      componentProps: {
        car_id: this.mylocations[index]['vehicleID'],
        booking_id: this.mylocations[index]['bid'],
      }
    });
    return await modal.present();
  } 

  async pay(index){

    console.log(this.mylocations[index]['startDate']);
    console.log(this.mylocations[index]['endDate']);
    const regex = /-/gi;
    const debutTimestamp = new Date((this.mylocations[index]['startDate']).replace(regex ,'/')).getTime();
    const finTimestamp = new Date((this.mylocations[index]['endDate']).replace(regex ,'/')).getTime();

    console.log(debutTimestamp);
    console.log(finTimestamp);

    const ms = finTimestamp - debutTimestamp;
      let daysdif = ms / 1000;
      daysdif = daysdif / 60;
      daysdif = daysdif / 60;
      daysdif = daysdif / 24;

      console.log(daysdif);
    const modal = await this.modalController.create({
      component: ReservePage,
      //backdropDismiss: false,
      componentProps: {
        type: '1',
        days: daysdif,
        data: this.mylocations[index]
      }
    });
    return await modal.present();

  } 

  async endL(index) {
    const modal = await this.modalController.create({
      component: StartLocClientPage,
      backdropDismiss: false,
      componentProps: {
        data: this.mylocations[index],
        inv_step : 1
      }
    });
    return await modal.present();
  }

  async ionViewWillEnter() {
    const res = await this.db.getALocs();
    if (res['status'] === 'success') {
      console.log(res['data']);
      this.mylocations = res['data'];
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
      console.log(this.mylocations);
    }
  }
  

}
