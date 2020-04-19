import { Component, OnInit } from '@angular/core';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
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
    private modalController: ModalController) {

  }

  ngOnInit() {

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
    const res = await this.db.getMLocs();
    if (res['status'] === 'success') {
      this.mylocations = res['data'];
    }

  }

}
