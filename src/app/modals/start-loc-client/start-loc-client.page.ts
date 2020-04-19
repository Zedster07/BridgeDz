import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';

@Component({
  selector: 'app-start-loc-client',
  templateUrl: './start-loc-client.page.html',
  styleUrls: ['./start-loc-client.page.scss'],
})
export class StartLocClientPage implements OnInit {
  bookData = {};
  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private db: DbinteractionsService) { }

  close() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }
  
  async ngOnInit() {
    this.bookData = this.navParams.get('data');
    const res = await this.db.startLoc(this.bookData['id'] , this.bookData['vehicleID']);
  }

}
