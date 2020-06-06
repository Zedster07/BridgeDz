import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { LoadingService } from '../services/loading.service';
import { UtilService } from '../services/util.service';
import { GlobalsService } from '../services/globals.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DbinteractionsService } from '../services/dbinteractions.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-pwd',
  templateUrl: './pwd.page.html',
  styleUrls: ['./pwd.page.scss'],
})
export class PwdPage implements OnInit {

  pageSelected = 'pwd_request';
  email= '';
  pwd;
  new_pwd;
  token='';

  constructor(
     private glb: GlobalsService,
     private db : DbinteractionsService,
     private alert : AlertService,
     private loading: LoadingService,
     translate: TranslateService,
     private route: Router,
     private router: ActivatedRoute,
     private util: UtilService
  ) { }

  async pwdForgotten(){
    
    const resp = await this.db.passwordForgotten(this.email, this.util.makeid(20));
    if (resp['status'] === 'success'){
        this.alert.presentAlert('mot de passe', 'Nous venons de vous envoyer un mail pour renouvler votre mot de passe');
      }
   }

   async pwdChange(){
     console.log('pwdCahnge');
     if(this.new_pwd === this.pwd){
        const resp = await this.db.changePwd(this.pwd, this.new_pwd, this.token);
        if (resp['status'] === 'success'){
          this.alert.presentAlert('mot de passe', 'Votre mot de passe est mis à jour');
          this.route.navigate(['login']);
        }
      } else {
        this.alert.presentAlert('mot de passe', 'Votre mot de passe de confirmation ne correspond pas à votre mot de passe');
      }
    }

  ngOnInit() {
    this.token = this.router.snapshot.paramMap.get('token');
    console.log(this.token);
    if (this.token != null){
      this.pageSelected = 'pwd_change';
    }
  }

}
