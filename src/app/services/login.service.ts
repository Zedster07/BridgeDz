import { Injectable } from '@angular/core';
import { HttpClient , HttpErrorResponse , HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { GlobalsService } from './globals.service';
import { LoadingService } from './loading.service';
import { Storage } from '@ionic/storage';
import { Httpresponse } from '../interfaces/httpresponse';
import { Httprequest } from '../interfaces/httprequest';
import { UserData } from '../interfaces/user-data';
import { Router } from '@angular/router';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from './alert.service';
const TOKEN_KEY = 'logToken';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  authenticationState = new BehaviorSubject(this.hasToken());

  constructor(
    private glb: GlobalsService,
    private http: HttpClient ,
    private storage: Storage,
    private loading: LoadingService,
    private route: Router,
    private fireauth: AngularFireAuth,
    private alertt: AlertService
  ) {

  }

  isLoggedIn() {
    return this.authenticationState.value;
  }

  async register(authResult: any, logHandle: any, tp: string , data: any): Promise<any> {

    if (tp === '1') {
      const provider = authResult.authResult.additionalUserInfo.providerId;
      this.glb.user.type = tp;
      this.glb.user.email = authResult.authResult.additionalUserInfo.profile['email'];
      if ( provider === 'facebook.com' ) {
        this.glb.user.lname = authResult.authResult.additionalUserInfo.profile['last_name'];
        this.glb.user.fname = authResult.authResult.additionalUserInfo.profile['first_name'];
        this.glb.user.pic = authResult.authResult.additionalUserInfo.profile['picture']['data']['url'];
      } else {
        this.glb.user.lname = authResult.authResult.additionalUserInfo.profile['family_name'];
        this.glb.user.fname = authResult.authResult.additionalUserInfo.profile['given_name'];
        this.glb.user.pic = authResult.authResult.additionalUserInfo.profile['picture'];
      }

      const httpparams = new HttpParams()
      .append('type' , tp)
      .append('fname', this.glb.user.fname)
      .append('lname' , this.glb.user.lname)
      .append('email' , this.glb.user.email)
      .append('pic' , this.glb.user.pic);

      const result = await this.http.post<Httpresponse>(this.glb.hostServer + 'register.php' , httpparams )
      .toPromise().then(resp => {
        console.log(resp);
        this.glb.user.id = resp.data['id'];
        if ( resp.data['picture'].indexOf('http') !== -1 || resp.data['picture'].indexOf('https') !== -1 ) {
          this.glb.user.pic = resp.data['picture'];
        } else {
          this.glb.user.pic = this.glb.hostServer + resp.data['picture'];
        }

        localStorage.setItem(TOKEN_KEY , 'true');
        localStorage.setItem('userid' , this.glb.user.id);
        localStorage.setItem('userfname' , this.glb.user.fname);
        localStorage.setItem('userlname' , this.glb.user.lname);
        localStorage.setItem('useremail' , this.glb.user.email);
        localStorage.setItem('userpic' , this.glb.user.pic);
        this.authenticationState.next(true);
        this.reloadUserData();
        return resp;
      }).catch(err => {
        console.error('There is an Error Somewhere' , err);
        logHandle.signOut();
        return null;
      }).finally(() => {
        this.loading.dismissLoading();
      });

      if ( result ) {
        return true;
      } else {
        return false;
      }
    } else {
      const httpparams = new HttpParams()
      .append('type' , tp)
      .append('username' , data.username)
      .append('email' , data.email)
      .append('password' , data.password);
      const result = await this.http.post<Httpresponse>(this.glb.hostServer + 'register.php' , httpparams )
      .toPromise().then(resp => {
        console.log(resp);
        if (resp.status === 'success') {
          this.alertt.presentAlert('Success' , 'Bonne nouvelle, votre compte est crée.');
        }
        return resp;
      })
      .catch(err => {
        console.log(err);
        return null;
      }).finally(() => {
        this.loading.dismissLoading();
      });
      return await result;
    }
  }
  clearNulls(data: any) {
    const something = data;
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key] === 'null' || data[key] === null) {
          something[key] = '';
        }
      }
    }
    return something;
  }
  async logIn(authResult: FirebaseUISignInSuccessWithAuthResult , logHandle: any, tp: string , logData: any ): Promise<any> {
    let user: any;
    if (tp === '1') {
      user = authResult.authResult.user;
    } else {
      user = logData;
    }
    const httpParams = new HttpParams()
    .append('type', tp)
    .append('email', user.email)
    .append('password', user.password);

    const result = await this.http.post<Httpresponse>(this.glb.hostServer + 'login.php' , httpParams).toPromise().then(resp => {
      if (resp.status === 'Failure') {
        console.log(resp.data);
        return resp;
      } else if (resp.status === 'success') {
        if ( resp.data['picture'].indexOf('http') !== -1) {
          console.log(resp.data['picture'].indexOf('http'));
          this.glb.user.pic = resp.data['picture'];
        } else {
          this.glb.user.pic = this.glb.hostServer + resp.data['picture'];
          console.log(this.glb.user.pic);
        }
        resp.data = this.clearNulls(resp.data);
        console.log(resp.data);
        localStorage.setItem(TOKEN_KEY , 'true');
        this.authenticationState.next(true);
        localStorage.setItem('userid' , resp.data['id']);
        localStorage.setItem('userfname' , resp.data['fname']);
        localStorage.setItem('userlname' , resp.data['lname']);
        localStorage.setItem('useremail' , resp.data['email']);
        localStorage.setItem('userpic' , this.glb.user.pic);
        localStorage.setItem('userphone' , resp.data['phone']);
        localStorage.setItem('userusername' , resp.data['username']);
        localStorage.setItem('userpob' , resp.data['placeOfbirth']);
        localStorage.setItem('userdob' , resp.data['dob']);
        localStorage.setItem('userpassword' , resp.data['password']);
        localStorage.setItem('address' , resp.data['address']);
        localStorage.setItem('usercp' , resp.data['codePostal']);
        localStorage.setItem('userpays' , resp.data['Country']);
        localStorage.setItem('userville' , resp.data['ville']);
        localStorage.setItem('userpropos' , resp.data['propos']);
        localStorage.setItem('userStatus' , resp.data['activeAccount']);
        this.reloadUserData();
        return resp;
      }

    }).catch((err: HttpErrorResponse) => {
      console.error(err);
      logHandle.signOut();
      return null;
    }).finally(() => {
      this.loading.dismissLoading();
    });

    return result;
  }
  setLocalstorage(index , data) {
    localStorage.setItem(index , data);
  }
  reloadUserData() {
    this.glb.user.id = localStorage.getItem('userid');
    this.glb.user.fname = localStorage.getItem('userfname');
    this.glb.user.lname = localStorage.getItem('userlname');
    this.glb.user.email = localStorage.getItem('useremail');
    this.glb.user.pic = localStorage.getItem('userpic');
    this.glb.user.phoneNumber = localStorage.getItem('userphone');
    this.glb.user.username = localStorage.getItem('userusername');
    this.glb.user.pob = localStorage.getItem('userpob');
    this.glb.user.dob = localStorage.getItem('userdob');
    this.glb.user.password = localStorage.getItem('userpassword');
    this.glb.user.address = localStorage.getItem('address');
    this.glb.user.codeP = localStorage.getItem('usercp');
    this.glb.user.country = localStorage.getItem('userpays');
    this.glb.user.ville = localStorage.getItem('userville');
    this.glb.user.propos = localStorage.getItem('userpropos');
    this.glb.user.userStatus = localStorage.getItem('userStatus');
    
   // this.glb.usertmp = this.glb.user;
  }
  getStorage(index) {
    return localStorage.getItem(index);
  }
  logOut() {
    localStorage.removeItem(TOKEN_KEY);
    this.authenticationState.next(false);
    this.fireauth.auth.signOut().then(() => {
      this.glb.resetData();
      this.route.navigate(['login']);
    });
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }
}
