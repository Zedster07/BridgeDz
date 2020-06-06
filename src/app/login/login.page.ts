import { Component, OnInit } from '@angular/core';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure, FirebaseuiAngularLibraryService } from 'firebaseui-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { LoginService } from '../services/login.service';
import { AlertService } from '../services/alert.service';
import { LoadingService } from '../services/loading.service';
import { GlobalsService } from '../services/globals.service';
import { Httpresponse } from '../interfaces/httpresponse';
import { DbinteractionsService } from '../services/dbinteractions.service';
import { role_user } from '../interfaces/role_user';
import { login_type } from '../interfaces/login_type';
import { support_type } from '../interfaces/support_type';
import { UtilService } from '../services/util.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import {TranslateService} from '@ngx-translate/core';
import { HttpClient , HttpErrorResponse , HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  id_token :any;
  pageSelected = 'login';
  normalLogin = {
    email: '',
    password: ''
  };

  LOGIN_INVALID_MAIL='LOGIN.INVALID_MAIL';
  LOGIN_INVALID_MAIL_1;
  signupData = {
    username: '',
    email: '',
    password: '',
    re_password: ''
  };
  constructor(
     private firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService ,
     private glb: GlobalsService,
     private db : DbinteractionsService,
     private angularFireAuth: AngularFireAuth ,
     private authService: LoginService,
     private alert : AlertService,
     private loading: LoadingService,
     private route: Router,
     private router: ActivatedRoute,
     private util: UtilService,
     private deviceService: DeviceDetectorService,
     private translate: TranslateService,
     private http: HttpClient,
     ) {
      this.glb.globalLoading(true);
  }
  changepPage(page: string) {
    this.pageSelected = page;
  }
  async Register() {
    const error = document.getElementById('signuperror');
    if (this.signupData.email === '') {
      this.translate.get('LOGIN.ALL_FIELD_REQUIRED').subscribe((res: string) => {
        error.textContent = res;
      });
      error.style.display = 'block';
      return false;
    }
    if (!this.validateEmail(this.signupData.email)) {
      this.translate.get('LOGIN.INVALID_MAIL').subscribe((res: string) => {
        error.textContent = res;
      });
      error.style.display = 'block';
      return false;
    }
    switch (this.glb.correctPassword(this.signupData.password)) {
      case 0:
        this.translate.get('LOGIN.ENTER_PASSWORD').subscribe((res: string) => {
          error.textContent = res;
        });
        error.style.display = 'block';
        return false;
        break;
      case 1:
        this.translate.get('LOGIN.PWD_6CAR').subscribe((res: string) => {
          error.textContent = res;
        });
        error.style.display = 'block';
        return false;
      default:
        break;
    }
    if ( this.signupData.password !== this.signupData.re_password ) {
      this.translate.get('LOGIN.PWD_CONFIRM_ERROR').subscribe((res: string) => {
        error.textContent = res;
      });
      error.style.display = 'block';
      return false;
    }
    error.style.display = 'none';
    this.loading.presentLoading_generic('LOADING_REGISTER');
    const result = await this.authService.register( null , this.angularFireAuth.auth , '2' , this.signupData);
    if ( result.status === 'exists') {
      this.translate.get('LOGIN.ACCOUNT_EXIST').subscribe((res: string) => {
        error.textContent = this.signupData.email + res;
      });
      error.style.display = 'block';
    } else if ( result.status === 'success' ) {
      this.route.navigate(['login']);
      error.style.display = 'none';
      this.alert.presentAlert('LOGIN.ACCOUNT_VALID_TITLE', 'LOGIN.ACOUNT_VALID_MSG');
    }
  }
  async normallogin() {
    const error = document.getElementById('loginerror');
    if ( !this.validateEmail( this.normalLogin.email ) ) {
       this.translate.get('LOGIN.INVALID_MAIL').subscribe((res: string) => {
        error.textContent = res;
      });
      error.style.display = 'block';
    } else if ( this.glb.correctPassword(this.normalLogin.password) !== 2 ) {
      switch (this.glb.correctPassword(this.normalLogin.password)) {
        case 0:
          this.translate.get('LOGIN.ENTER_PASSWORD').subscribe((res: string) => {
              error.textContent = res;
          });
          error.style.display = 'block';
          break;
        case 1:
          this.translate.get('LOGIN.EMAIL_PWD_INCORECT').subscribe((res: string) => {
            error.textContent = res;
           });
          error.style.display = 'block';
          break;
        default:
          break;
      }
    } else {
      error.style.display = 'none';
      this.loading.presentLoading_generic('LOGIN.LOADING_WAIT_1');
      const result = await this.authService.logIn(null , this.angularFireAuth.auth , '2' , this.normalLogin);
      if (result.status === 'Failure' && result.message !== 'account_not_activated') {
        error.textContent = result.message;
        error.style.display = 'block';
      } else if (result.status === 'success') {
        console.log(this.deviceService.ua);
        const res_paramacc = await this.db.getAccParams();
        const res = await this.db.addHistoricalLogIn( this.deviceService.getDeviceInfo().device,
                                                      this.util.getLocation(),
                                                      this.translate.getBrowserLang(),
                                                      login_type.normal,
                                                      this.deviceService.getDeviceInfo().os,
                                                      this.deviceService.getDeviceInfo().os_version,
                                                      this.deviceService.getDeviceInfo().browser,
                                                      this.deviceService.getDeviceInfo().browser_version,
                                                      this.deviceService.getDeviceInfo().userAgent,
                                                      this.util.getSupportType(),
                                                      );
         this.util.getAccParam_1(this.glb.accparams, res_paramacc);
         this.glb.resetAdmin();
       
        if (this.glb.ifAdmin(this.glb.user.role) === true){
          this.route.navigate(['dashboard']);
        } else if (this.glb.prevAction === '' && this.glb.ifAdmin(this.glb.user.role)  === false){
          this.route.navigate(['client']);
        } else if (this.glb.prevAction === 'book' && this.glb.ifAdmin(this.glb.user.role) === false) {
          this.route.navigate(['search']);
        }
      } else if (result.message === 'account_not_activated') {
        this.translate.get('LOGIN.ACCOUNT_NOT_ACTIVATED').subscribe((res: string) => {
          error.textContent = res;
        });
        error.style.display = 'block';
      }
    }
  }

  /*async generateNewPassword(){
    const httpParams = new HttpParams()
    .append('request', 'regeneratePassword');
    return await this.http.post<Httpresponse>(this.glb.hostServer + 'login.php', httpParams).toPromise().then( resp => {
      return resp;
    }).catch(err => {
      console.error(err);
      return false;
    });
  }*/
  
  async passwordForgotten(){
      this.route.navigate(['pwd']);
  }


  
  validateEmail(email: string) {
    // tslint:disable-next-line: max-line-length
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  async successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    this.loading.presentLoading_generic('LOGIN.LOADING_WAIT_1');
    console.log(signInSuccessData.authResult);
    const error = document.getElementById('loginerror');
    if (signInSuccessData.authResult.additionalUserInfo.isNewUser) {
      console.log('is a new user');
      const result = await this.authService.register(signInSuccessData , this.angularFireAuth.auth , '1' , null);
      if ( result ) {
        console.log('redirecting to client');
        if (this.glb.ifAdmin(this.glb.user.role) === true){
          this.route.navigate(['dashboard']);
        } else if (this.glb.prevAction === '' && this.glb.ifAdmin(this.glb.user.role)  === false){
          this.route.navigate(['client']);
        } else if (this.glb.prevAction === 'book' && this.glb.ifAdmin(this.glb.user.role) === false) {
          this.route.navigate(['search']);
        }
        error.style.display = 'none';
      } else {
        this.translate.get('LOGIN.505').subscribe((res: string) => {
          error.textContent = res;
        });
        error.style.display = 'block';
      }
    } else {
      const result = await this.authService.logIn(signInSuccessData , this.angularFireAuth.auth , '1' , null );
      if ( result.status !== 'Failure' ) {
        const res_paramacc = await this.db.getAccParams();
        const res = await this.db.addHistoricalLogIn(this.deviceService.getDeviceInfo().device,
                                                      this.util.getLocation(),
                                                      this.translate.getBrowserLang(),
                                                      login_type.gmail,
                                                      this.deviceService.getDeviceInfo().os,
                                                      this.deviceService.getDeviceInfo().os_version,
                                                      this.deviceService.getDeviceInfo().browser,
                                                      this.deviceService.getDeviceInfo().browser_version,
                                                      this.deviceService.getDeviceInfo().userAgent,
                                                      this.util.getSupportType());
        
         this.util.getAccParam_1(this.glb.accparams, res_paramacc);
         this.glb.resetAdmin();
         
        if (this.glb.ifAdmin(this.glb.user.role) === true){
          console.log("ADMIN");
          this.route.navigate(['dashboard']);
        } else if (this.glb.prevAction === '' && this.glb.ifAdmin(this.glb.user.role)  === false){
          this.route.navigate(['client']);
        } else if (this.glb.prevAction === 'book' && this.glb.ifAdmin(this.glb.user.role) === false) {
          this.route.navigate(['search']);
        }
        error.style.display = 'none';
      } else if (result.message === 'account_not_activated') {
        this.translate.get('LOGIN.ACCOUNT_NOT_ACTIVATED').subscribe((res: string) => {
          error.textContent = res;
        });
        error.style.display = 'block';
      } else {
        this.translate.get('LOGIN.505').subscribe((res: string) => {
          error.textContent = res;
        });
        error.style.display = 'block';
      }
    }
  }
  errorCallback(errorData: FirebaseUISignInFailure) {

  }

  ionViewWillEnter() {
    this.glb.isMainPage = false;
  }
  async ngOnInit() {
    console.log("ip :");
  

    let id_token = '';
    id_token = this.router.snapshot.paramMap.get('id');
    console.log(id_token);
    if (this.id_token !== ''){
      let res = await this.db.validateAccount(id_token);
      if (res['status'] === 'success'){
        this.alert.presentAlert('LOGIN.VALIDATION_TITLE', 'LOGIN.VALIDATION_MSG');
      }
    }
    this.glb.globalLoading(false);
    if (this.authService.isLoggedIn() && this.glb.ifAdmin(this.glb.user.role) === false) {
      this.route.navigate(['client']);
    }
  }

}
