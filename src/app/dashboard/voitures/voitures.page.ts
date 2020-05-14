import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddCarModalPage } from 'src/app/modals/add-car-modal/add-car-modal.page';
import { AccessHoursPage } from 'src/app/modals/access-hours/access-hours.page';
import { CarAvailabilityPage } from 'src/app/modals/car-availability/car-availability.page';
import { CarValidateModalPage } from 'src/app/modals/car-validate-modal/car-validate-modal.page';
import { CarAvailabilityV1Page } from 'src/app/modals/car-availability-v1/car-availability-v1.page'
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
        type: '',
        actionType: '0',
        data: ''
      }
    });

    modal.onDidDismiss().then((result) => {
      
    });
    return await modal.present();
  }

  async modifyCar(index) {
    let CarData =  this.glb.cars[index];
    const modal = await this.modalController.create({
      component: AddCarModalPage,
      backdropDismiss: false,
      componentProps: {
        type: '',
        actionType: '1',
        data: CarData
      }
    });
    return await modal.present();
  }

  async validateCar(index) {
    let CarData =  this.glb.cars[index];
    const modal = await this.modalController.create({
      component: CarValidateModalPage,
      backdropDismiss: true,
      componentProps: {
        type: '',
        actionType: '1',
        data: CarData
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
    let CarData =  this.glb.cars[index];
    const modal = await this.modalController.create({
      component: CarAvailabilityV1Page,
      // backdropDismiss: false,
      componentProps: {
        type: '',
        data: CarData,
        idx: this.glb.cars[index]['id']
      }
    });

    modal.onDidDismiss().then((result) => {
      this.glb.selectedDays = [];
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
    if (this.glb.isViewCars === false){
      const id = this.db.getStorage('accID');
      if (this.glb.cars.length === 0 || this.glb.ifAdmin(this.glb.user.role)){
        const res = await this.db.fetchCars(id, this.glb.user.id);
        if (res && res.status !== 'failure') {
          this.glb.cars = res.data;
        }
      }
    }
  }

  async ionViewDidLeave() {
    this.glb.isViewCars = false;
  }

  ngOnInit() {
  }

}
