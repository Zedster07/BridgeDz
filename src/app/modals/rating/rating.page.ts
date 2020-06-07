import { Component, OnInit } from '@angular/core';
import { ModalController , NavParams} from '@ionic/angular';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.page.html',
  styleUrls: ['./rating.page.scss'],
})
export class RatingPage implements OnInit {

  car_id;
  bookind_id;
  isActive = [
 
   {
    'first' : "star-outline",
    'second': "star-outline",
    'third' : "star-outline",
    'fouth' : "star-outline",
    'fifth' : "star-outline",
     'note' : 0
   },
   {
    'first' : "star-outline",
    'second': "star-outline",
    'third' : "star-outline",
    'fouth' : "star-outline",
    'fifth' : "star-outline",
    'note' : 0
   },
   {
    'comment' :'',
 },
];

  constructor(
    public modalCtrl: ModalController,
    private db: DbinteractionsService,
    private navParams: NavParams,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.car_id = this.navParams.get('car_id');
    this.bookind_id = this.navParams.get('booking_id');
  }

  async validate(){
    const resp = await this.db.review(this.car_id, this.bookind_id, this.isActive);
    if( resp['status'] === 'success' ){
      this.alert.presentAlert('POPUP.PWD_UPDATE_RATING_TITLE' , 'POPUP.PWD_UPDATE_RATING_MSG');
      this.close();
    }
  }

  cancel(){
    this.close();
  }

  close() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  change(i, k) {
    console.log('hello');
    switch (i){
      case 0 :
          this.isActive[k].first = "star";
          this.isActive[k].second = "star-outline";
          this.isActive[k].third = "star-outline";
          this.isActive[k].fouth = "star-outline";
          this.isActive[k].fifth = "star-outline";
          this.isActive[k].note = 1;
        break;
      case 1 :
          this.isActive[k].first = "star";
          this.isActive[k].second = "star";
          this.isActive[k].third = "star-outline";
          this.isActive[k].fouth = "star-outline";
          this.isActive[k].fifth = "star-outline";
          this.isActive[k].note = 2;
        break;
      case 2:
          this.isActive[k].first = "star";
          this.isActive[k].second = "star";
          this.isActive[k].third = "star";
          this.isActive[k].fouth = "star-outline";
          this.isActive[k].fifth = "star-outline";
          this.isActive[k].note = 3;
        break;
      case 3 :
          this.isActive[k].first = "star";
          this.isActive[k].second = "star";
          this.isActive[k].third = "star";
          this.isActive[k].fouth = "star";
          this.isActive[k].fifth = "star-outline";
          this.isActive[k].note = 4;
        break;
      case 4 :
          this.isActive[k].first = "star";
          this.isActive[k].second = "star";
          this.isActive[k].third = "star";
          this.isActive[k].fouth = "star";
          this.isActive[k].fifth = "star";
          this.isActive[k].note = 5;
        break;
    } 
  } 

}
