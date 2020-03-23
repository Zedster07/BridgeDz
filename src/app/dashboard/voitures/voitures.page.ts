import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddCarModalPage } from 'src/app/modals/add-car-modal/add-car-modal.page';
import { AccessHoursPage } from 'src/app/modals/access-hours/access-hours.page';
import { CarAvailabilityPage } from 'src/app/modals/car-availability/car-availability.page';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { GlobalsService } from 'src/app/services/globals.service';
@Component({
  selector: 'app-voitures',
  templateUrl: './voitures.page.html',
  styleUrls: ['./voitures.page.scss'],
})


export class VoituresPage implements OnInit {


  ismobile = false;
  constructor(
    public modalController: ModalController,
    public glb: GlobalsService,
    private db: DbinteractionsService) { }
  async showAddCarModal() {
    const modal = await this.modalController.create({
      component: AddCarModalPage,
      backdropDismiss: false,
      componentProps: {
        type: ''
      }
    });
    return await modal.present();
  }


  async showAccessHoursModal() {
    const modal = await this.modalController.create({
      component: AccessHoursPage,
      // backdropDismiss: false,
      componentProps: {
        type: ''
      }
    });
    return await modal.present();
  }


  async showCarAvailModal(index) {
    let CarData =  this.glb.myCars[index];
    const modal = await this.modalController.create({
      component: CarAvailabilityPage,
      // backdropDismiss: false,
      componentProps: {
        type: '',
        data: CarData,
        idx: this.glb.myCars[index]['id']
      }
    });
    return await modal.present();
  }


  getFrontPic(car: any) {
    const piclist = car['picturesList'];
    return this.glb.hostServer + piclist.substring( 0 , piclist.indexOf(','));
  }
  async ionViewWillEnter() {
    if (window.screen.width <= 360 ) {
      this.ismobile = true;
    } else {
      this.ismobile = false;
    }
    const id = this.db.getStorage('accID');
    const res = await this.db.fetchCars(id, this.glb.user.id);
    if (res && res.status !== 'failure') {
      this.glb.myCars = res.data;
    }
    console.log(this.glb.myCars);
  }


  ngOnInit() {
  }

}
