import { Injectable } from '@angular/core';
import { HttpClient , HttpErrorResponse , HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { GlobalsService } from './globals.service';
import { LoadingService } from './loading.service';
import { Storage } from '@ionic/storage';
import { Httpresponse } from '../interfaces/httpresponse';
import { support_type } from '../interfaces/support_type';
import { login_type } from '../interfaces/login_type';

import { isDevMode } from '@angular/core';

import { Httprequest } from '../interfaces/httprequest';
import { UserData } from '../interfaces/user-data';
import { account_status} from '../interfaces/account_status';
import { role_user } from '../interfaces/role_user';
import { Router } from '@angular/router';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AlertService } from './alert.service';

@Injectable({
    providedIn: 'root'
  })


export class UtilService {

  constructor(
    private glb: GlobalsService,
    private loading: LoadingService,
    private device: DeviceDetectorService,

  ) {

  }

  checkValid(param :any){
    if(param !== null || param !==undefined){
      return true;
    } else {
      return false;
    }
  }
  dsiplayRole(role: string){
    if (this.glb.ifClient(role)){
      return 'CLIENT';
    } else if (this.glb.ifAgency(role)){
      return 'AGENCY';
    } else if (this.glb.ifAdmin(role)){
      return 'ADMIN';
    } 
  }

  ifActivated(status: string){
        if (parseInt(status) == account_status.activated) {
            return true;
        }  else {
            return false;
        }
    }  
  ifDeactivated(status: string){
        if (parseInt(status) == account_status.deactivated) {
            return true;
        }  else {
            return false;
        }
    } 
  ifHidden(status: string){
        if (parseInt(status) == account_status.hidden) {
            return true;
        }  else {
            return false;
        }
    }    
    
  ifDepreicated(status: string){
      if (parseInt(status) == account_status.depricated) {
          return true;
      }  else {
          return false;
      }
  } 

  dsiplayStatus(status: string){
    if (this.ifHidden(status)){
      return 'HIDDEN';
    } else if (this.ifDeactivated(status)){
      return 'DEACTIVATED';
    } else if (this.ifActivated(status)){
      return 'ACTIVATED';
    } else if (this.ifDepreicated(status)){
      return 'DEPRICATED';
    }  
  }


  statusDB(status: string){
    if (status == 'HIDDEN'){
      return account_status.hidden;
    } else if (status = 'DEACTIVATED'){
      return account_status.deactivated;
    } else if (status = 'ACTIVATED'){
      return account_status.activated;
    } else if (status = 'DEPRICATED'){
      return account_status.depricated;
    }  
  }

  getSupportType(){
    if (this.device.isDesktop() === true) {
      return support_type.desktop;
    }  else if (this.device.isMobile() === true){
      return support_type.phone;
    }  else if  (this.device.isMobile() === true){
      return support_type.tablet
    }  else { 
      return support_type.unknown;
    } 
  }

  getLoginType(){
  }

  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  getLocation(){
    let location = 'PARIS';
    return location;
  }

  getImgLang(lang: string){
    switch (lang) {
      case 'ar' :
          return 'algeria.svg'
        break;
      case 'fr' :
          return 'france.svg'
        break;
      case 'en' :
        return 'usa.svg'
        break;
      case 'br' :
        return 'br.svg'
        break;
    } 
  }  


  deleteElementFromArray(arr: any, index: string){
    for (let i = 0; i < arr.length ; i++) {
        if (arr[i]['id'] === index)
        {
            arr.splice(i, 1);
        } 
        return arr;
      }
  }    

  getRaidoButtonChoice (id: string) {
    let toReturn = '-1';
    const arr = document.getElementsByName(id);
    for (let i=0 ; i< arr.length ; i++ ) {
      const input = arr[i] as HTMLInputElement ;
        if (input.checked){
          toReturn = input.value;
        }    
    }
    return toReturn; 
  }

  debug(msg_1: string, msg: any){
    if(isDevMode()){
        console.log(msg_1);
        console.log(msg);
    } 
  } 

  getYearString(){
    let today = new Date();
    return today.getFullYear().toString();
  } 
  getYearNumber(){
    let today = new Date();
    return today.getFullYear();
  } 
  getYearEpoch(){
  }  
  
  getMonthString(){
    let today = new Date();
    return (today.getMonth()+1).toString();
  } 
  getMonthNumber(){
    let today = new Date();
    return (today.getMonth()+1);
  } 
 

  getDayString(){
    let today = new Date();
    return (today.getDay()+1).toString();
  } 
  getDayNumber(){
    let today = new Date();
    return (today.getDay()+1);
  } 

  gettodayString(){
    let today = new Date();
    return today.toString();
  } 
  gettodayEpoch(){
    return new Date();
  }
  
  gettodayISOString(){
    let startD = new Date();
    startD = new Date(startD.getFullYear() + '/' + (startD.getMonth() + 1) + '/' + (startD.getDate()));
    return startD.toISOString();
  } 

  getfuturString(){
    return (new Date()).getFullYear() + 7;
  } 

  ifTrue(str: string){
    if (str === '1'){
      return true;
    } else {
      return false;
    } 
  }

  dateClandarFormat(date: string){
    let Year = date.split('-')[0];
    let Month = date.split('-')[1];
    let Day = date.split('-')[2].split(' ')[0];

    return new Date(parseInt(Year), parseInt(Month)-1, parseInt(Day), 10, 0, 0, 0);
  }

  getAccParam_1(accparams:any, data: any) {
    this.loading.presentLoading();
    
    console.log(data);
    this.loading.dismissLoading();
    this.glb.toReload = 1;
    if (data.status = 'success') {
      
      accparams.demandlocation[0] = this.ifTrue(data.data['demandlocation'][0]);
      accparams.demandlocation[1] = this.ifTrue(data.data['demandlocation'][1]);
      accparams.demandlocation[2] = this.ifTrue(data.data['demandlocation'][2]);

      accparams.emailpromo[0] = this.ifTrue(data.data['emailpromo'][0]);
      accparams.emailpromo[1] = this.ifTrue(data.data['emailpromo'][1]);
      accparams.emailpromo[2] = this.ifTrue(data.data['emailpromo'][2]);

      accparams.locAccept[0] = this.ifTrue(data.data['locAccept'][0]);
      accparams.locAccept[1] = this.ifTrue(data.data['locAccept'][1]);
      accparams.locAccept[2] = this.ifTrue(data.data['locAccept'][2]);

      accparams.loccancel[0] = this.ifTrue(data.data['loccancel'][0]);
      accparams.loccancel[1] = this.ifTrue(data.data['loccancel'][1]);
      accparams.loccancel[2] = this.ifTrue(data.data['loccancel'][2]);

      accparams.locrappel[0] = this.ifTrue(data.data['locrappel'][0]);
      accparams.locrappel[1] = this.ifTrue(data.data['locrappel'][1]);
      accparams.locrappel[2] = this.ifTrue(data.data['locrappel'][2]);

      accparams.redemandlocation[0] = this.ifTrue(data.data['redemandlocation'][0]);
      accparams.redemandlocation[1] = this.ifTrue(data.data['redemandlocation'][1]);
      accparams.redemandlocation[2] = this.ifTrue(data.data['redemandlocation'][2]);
    }
  }


   number_format(number, decimals, dec_point, thousands_sep) {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = [],
      toFixedFix = function(n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.round(n * k) / k;
      };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  }

  
  
  
}  
  

