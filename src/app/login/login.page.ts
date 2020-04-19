import { Component, OnInit } from '@angular/core';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure, FirebaseuiAngularLibraryService } from 'firebaseui-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { LoadingService } from '../services/loading.service';
import { GlobalsService } from '../services/globals.service';
import { DbinteractionsService } from '../services/dbinteractions.service';
import { role_user } from '../interfaces/role_user';
import { login_type } from '../interfaces/login_type';
import { support_type } from '../interfaces/support_type';
import { UtilService } from '../services/util.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  pageSelected = 'login';
  normalLogin = {
    email: '',
    password: ''
  };

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
     private loading: LoadingService,
     private route: Router,
     private util: UtilService,
     private deviceService: DeviceDetectorService,
     private translate: TranslateService,
     ) {
      this.glb.globalLoading(true);
  }
  changepPage(page: string) {
    this.pageSelected = page;
  }
  async Register() {
    const error = document.getElementById('signuperror');
    console.log('something');
    console.log(this.signupData.password);
    if (this.signupData.email === '') {
      error.textContent = 'All fields are required';
      error.style.display = 'block';
      return false;
    }
    if (!this.validateEmail(this.signupData.email)) {
      error.textContent = 'Invalid Email Format';
      error.style.display = 'block';
      return false;
    }
    switch (this.glb.correctPassword(this.signupData.password)) {
      case 0:
        error.textContent = 'Entrez votre mot de pass';
        error.style.display = 'block';
        return false;
        break;
      case 1:
        error.textContent = 'Votre mot de pass doit etre superieur à 6 caractéres';
        error.style.display = 'block';
        return false;
      default:
        break;
    }
    if ( this.signupData.password !== this.signupData.re_password ) {
      error.textContent = 'Votre mot de pass de confirmation ne correspond pas à votre mot de pass';
      error.style.display = 'block';
      return false;
    }
    error.style.display = 'none';
    this.loading.registerLoading();
    const result = await this.authService.register( null , this.angularFireAuth.auth , '2' , this.signupData);
    if ( result.status === 'exists') {
      error.textContent = this.signupData.email + ' est déja utilisé. Veuillez resnginer un autre e-mail. ';
      error.style.display = 'block';
    } else if ( result.status === 'success' ) {
      this.route.navigate(['login']);
      error.style.display = 'none';
    }
  }
  async normallogin() {
    const error = document.getElementById('loginerror');
    if ( !this.validateEmail( this.normalLogin.email ) ) {
      error.textContent = 'Invalid email format!';
      error.style.display = 'block';
    } else if ( this.glb.correctPassword(this.normalLogin.password) !== 2 ) {
      console.log('qsdqd'); 
      switch (this.glb.correctPassword(this.normalLogin.password)) {
        case 0:
          error.textContent = 'Please enter your password!';
          error.style.display = 'block';
          break;
        case 1:
          error.textContent = 'Email or password incorrect!';
          error.style.display = 'block';
          break;
        default:
          break;
      }
    } else {
      error.style.display = 'none';
      this.loading.signupLoading();
      const result = await this.authService.logIn(null , this.angularFireAuth.auth , '2' , this.normalLogin);
      if (result.status === 'Failure') {
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
      }
    }
  }
  
  validateEmail(email: string) {
    // tslint:disable-next-line: max-line-length
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  async successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    this.loading.presentLoading();
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
        error.textContent = '505 - Something went wrong';
        error.style.display = 'block';
      }
    } else {
      console.log('not a new user');
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
          console.log("this.route.navigate(['client']);");
          this.route.navigate(['client']);
        } else if (this.glb.prevAction === 'book' && this.glb.ifAdmin(this.glb.user.role) === false) {
          console.log("this.route.navigate(['search']);");
          this.route.navigate(['search']);
        }
        error.style.display = 'none';
      } else {
        error.textContent = '505 - hSomething went wrong';
        error.style.display = 'block';
      }
    }
  }
  errorCallback(errorData: FirebaseUISignInFailure) {

  }

  ionViewWillEnter() {
    this.glb.isMainPage = false;
  }
  ngOnInit() {
    this.glb.globalLoading(false);
    if (this.authService.isLoggedIn() && this.glb.ifAdmin(this.glb.user.role) === false) {
      console.log("this.route.navigate(['client']);");
      this.route.navigate(['client']);
    }
  }

}
