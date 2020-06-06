import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = false;
  constructor(public loadingController: LoadingController, private translate: TranslateService) { }
  
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

  async registerLoading() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Veuillez patienter svp. Nous créons votre compte',
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }

  async signupLoading() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Un instant svp.',
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

  async presentLoading_generic(msg) {
    console.log(msg);
    let msg_t;
    this.translate.get(msg).subscribe((res:string)=> {
      msg_t = res;
    });
    console.log(msg_t);
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: msg_t,
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }
}
