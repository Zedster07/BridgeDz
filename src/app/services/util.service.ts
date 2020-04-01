import { Injectable } from '@angular/core';
import { HttpClient , HttpErrorResponse , HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { GlobalsService } from './globals.service';
import { LoadingService } from './loading.service';
import { Storage } from '@ionic/storage';
import { Httpresponse } from '../interfaces/httpresponse';
import { Httprequest } from '../interfaces/httprequest';
import { UserData } from '../interfaces/user-data';
import { account_status} from '../interfaces/account_status';
import { role_user } from '../interfaces/role_user';
import { Router } from '@angular/router';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from './alert.service';

@Injectable({
    providedIn: 'root'
  })


export class UtilService {

  constructor(
    private glb: GlobalsService,
    private loading: LoadingService,
  ) {

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
  

