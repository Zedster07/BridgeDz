import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = false;
  constructor(public loadingController: LoadingController) { }
  async presentLoading() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Patientez s\'il vous plaît',
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }
  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController.dismiss();
  }
}
