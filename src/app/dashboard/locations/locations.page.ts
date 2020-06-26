import { Component, OnInit } from '@angular/core';
 import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
 import { ModalController } from '@ionic/angular';
 import { StartLocAgencyPage } from 'src/app/modals/start-loc-agency/start-loc-agency.page';
 import { GlobalsService } from 'src/app/services/globals.service';
 import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {

  mylocations = [];

  constructor(
     public glb: GlobalsService,
     private db: DbinteractionsService,
     private modalController: ModalController,
     public util: UtilService) {

   }

   async ngOnInit() {
  }


  cancelBooking(i) {
  }

  getFrontPic(car: any) {
    const piclist = car['picturesList'];
    return this.glb.hostServer + piclist.substring( 0 , piclist.indexOf(','));
  }


  async startL(index) {
    const modal = await this.modalController.create({
      component: StartLocAgencyPage,
      backdropDismiss: true,
      componentProps: {
        data: this.mylocations[index],
        type_book : 0,
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
        type_book : 0,
        inv_step : 1
      }
    });
    return await modal.present();
  }


  generateBilling(i){
  }
  
  async ionViewWillEnter() {
    const res = await this.db.getMLocs();
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
