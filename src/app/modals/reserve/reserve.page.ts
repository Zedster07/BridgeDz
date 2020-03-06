import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, PopoverController } from '@ionic/angular';
import { GlobalsService } from 'src/app/services/globals.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { ClientMenuListComponent } from 'src/app/client/client-menu-list/client-menu-list.component';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.page.html',
  styleUrls: ['./reserve.page.scss'],
})
export class ReservePage implements OnInit {
  data = {};
  picsList = [];
  days = 0;
  slideOpts = {
    slidesPerView: 1.5,
    initialSlide: 0,
    speed: 400
  };
  constructor(
    private navParams: NavParams ,
    private glb: GlobalsService,
    private db: DbinteractionsService,
    private authService: LoginService,
    private route: Router,
    private modalCtrl: ModalController
     ) { }


  public closeModal() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }
  async reserverCar() {
    const book = {
      totalprice: this.days * this.data['pricePerDay'] ,
      startdate: this.glb.searchQuery.startdate ,
      enddate: this.glb.searchQuery.enddate,
      idClient: this.glb.user.id,
      car: this.data,
      days: this.days,
      idCar: this.data['id']};

    if (this.authService.isLoggedIn()) {
      const res = await this.db.reserveCar(book);
      if (res['status'] === 'success') {
        this.closeModal();

      }
    } else {
      this.glb.prevAction = 'book';
      this.glb.prevBook = book;
      this.closeModal();
      this.route.navigate(['login']);
    }
  }
 
  ngOnInit() {
      this.data = this.navParams.get('data');
      this.days = this.navParams.get('days');
      let pics = this.data['picturesList'];
      let index = 0;
      while (pics !== '') {
        if (pics.indexOf(',') === -1) {
          this.picsList.push(pics);
          pics = '';
        } else {
          let indexEnd = pics.indexOf(',');
          let tmp = pics.substring(index , indexEnd);
          this.picsList.push(this.glb.hostServer + tmp);
          pics = pics.substring(indexEnd + 1);
          console.log('tmp = ' + tmp);
          console.log('pics = ' + pics);
        }
      }
      console.log(this.picsList);
      
  }
  onClick() {
    console.log(this.data);
  }

}
