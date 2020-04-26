import { Component, OnInit } from '@angular/core';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { BillingService } from 'src/app/services/billing.service';
import { ModalController } from '@ionic/angular';
import { StartLocClientPage } from 'src/app/modals/start-loc-client/start-loc-client.page';



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
     private bill: BillingService) {
  
  }

  ngOnInit() {
  }

  generateBilling(index){
    this.bill.generateClientBilling(this.mylocations[index]);
  }

  
   

  async startL(index) {
    const modal = await this.modalController.create({
      component: StartLocClientPage,
      backdropDismiss: false,
      componentProps: {
        data: this.mylocations[index]
      }
    });
    return await modal.present();
  }

  async ionViewWillEnter() {
    const res = await this.db.getALocs();
    if (res['status'] === 'success') {
      console.log(res['data']);
      this.mylocations = res['data'];
    }
  }
  

}
