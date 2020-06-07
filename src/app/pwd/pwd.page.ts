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
        this.alert.presentAlert('POPUP.PWD_CHANGE_TITLE' , 'POPUP.PWD_CHANGE_MSG');
      }
   }

   async pwdChange(){
     console.log('pwdCahnge');
     if(this.new_pwd === this.pwd && this.glb.correctPassword(this.new_pwd) === 2){
        const resp = await this.db.changePwd(this.pwd, this.new_pwd, this.token);
        if (resp['status'] === 'success'){
          this.alert.presentAlert('POPUP.PWD_UPDATE_TITLE' , 'POPUP.PWD_UPDATE_MSG');
          this.route.navigate(['login']);
        }
      } else if (this.new_pwd !== this.pwd){
        this.alert.presentAlert('POPUP.PWD_UPDATE_TITLE' , 'POPUP.PWD_UPDATE_ERROR_MSG');
      } else if (this.glb.correctPassword(this.new_pwd) === 0){
        this.alert.presentAlert('POPUP.PWD_UPDATE_TITLE' , 'POPUP.PWD_FORMAT_NOT_CORRECT');
      } else if (this.glb.correctPassword(this.new_pwd) === 1){
        this.alert.presentAlert('POPUP.PWD_UPDATE_TITLE' , 'POPUP.PWD_FORMAT_NOT_CORRECT');
      }else if (this.glb.correctPassword(this.new_pwd) === 4){
        this.alert.presentAlert('POPUP.PWD_UPDATE_TITLE' , 'POPUP.PWD_FORMAT_NOT_CORRECT');
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
