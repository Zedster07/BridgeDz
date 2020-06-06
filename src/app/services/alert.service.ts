import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GlobalsService } from './globals.service';
import { HttpClient , HttpErrorResponse , HttpParams } from '@angular/common/http';
import { LoadingService } from './loading.service';
import { Httpresponse } from '../interfaces/httpresponse';
import { ModalController } from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertt: AlertController ,
    private glb: GlobalsService ,
    private http: HttpClient ,
    private loading: LoadingService,
    private translate: TranslateService,
    public modalController: ModalController) { }
  async confirmPassword() {
    let something: any;
    const alert = await this.alertt.create({
      header: 'Votre Mot de passe actuel',
      inputs: [
        {
          name: 'passwordConfirm',
          type: 'password',
          placeholder: 'Mot de passe Actuel'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            something = 'canceled';
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirm',
          handler: (data) => {
            something = data.passwordConfirm;
            console.log('Confirm Ok');
          }
        }
      ]
    });
    await alert.present();
    return alert.onDidDismiss().then(() => {
      return something;
    });
  }
  async checkPass(data: string): Promise<any> {
    console.log('got data: ' + data );
    const httpparams = new HttpParams()
            .append('id' , this.glb.user.id)
            .append('password' , data);
    return await this.http.post<Httpresponse>(this.glb.hostServer + 'checkpass.php', httpparams ).toPromise().then( resp => {
      console.log(resp);
      if (resp.data['result'] === 'true') {
        return true;
      } else {
        return false;
      }
    }).catch(err => {
      console.error(err);
      return false;
    }).finally( () => {
      
    });
  }
  async presentAlert(title: string , msg: string) {
    let title_t ;
    let msg_t;
    let button_t;
    this.translate.get(title).subscribe((res: string) => {
      title_t = res;
    });
    this.translate.get(msg).subscribe((res:string)=> {
      msg_t = res;
    });
    this.translate.get('BUTTON.BUTTON_OK').subscribe((res:string)=> {
      button_t = res;
    });
    const alert = await this.alertt.create({
      header: title_t,
      message: msg_t,
      buttons: [button_t]
    });

    await alert.present();
  }

}
