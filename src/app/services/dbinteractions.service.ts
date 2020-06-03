import { Injectable } from '@angular/core';
import { GlobalsService } from './globals.service';
import { LoginService } from './login.service';
import { LoadingService } from './loading.service';
import { HttpClient , HttpErrorResponse , HttpParams, HttpEventType } from '@angular/common/http';
import { AlertService } from './alert.service';
import { UtilService } from './util.service';
import { Httpresponse } from '../interfaces/httpresponse';
import { UserData } from '../interfaces/user-data';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DbinteractionsService {
  public uploadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public downloadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(
    private glb: GlobalsService,
    private http: HttpClient,
    private logserv: LoginService,
    private loading: LoadingService,
    private alertt: AlertService,
    private util:UtilService) {}

    setStorage(key , value) {
      this.logserv.setLocalstorage(key , value);
    }

    async reloadEvents(idcar) {
      const httpparams = new HttpParams().append('request' , 'loadEvents')
      .append('idcar' , idcar);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async updateAvail(data , idcar) {
      let str = '';
      let i = 0;
      data.forEach(element => {
        str += element.startTime.getFullYear() + '/' + ( element.startTime.getMonth() + 1) + '/' + (element.startTime.getDate() - 1) ;
        i += 1;
        if (i !== data.length) {
          str += ',';
        }
      });

      const httpparams = new HttpParams().append('request' , 'updateAvail')
      .append('string' , str).append('idcar' , idcar);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }


    async updateAvail_v1(dateBusy, dateBookedInside, dateBookedOutside, datePreBooked, idcar,) {
      const httpparams = new HttpParams().append('request' , 'updateAvail_v1') .
      append('busy' , dateBusy).
      append('bookedInside' , dateBookedInside).
      append('bookedOutside' , dateBookedOutside).
      append('preBooked' , datePreBooked).
      append('idcar' , idcar).
      append('id_requestor', this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async passwordForgotten(email, token) {
      const httpParams = new HttpParams()
      .append('request', 'passwordForgotten').append('email', email).append('token', token);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpParams).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async changePwd(pwd, new_pwd, token) {
      const httpParams = new HttpParams()
      .append('request', 'changePwd').append('pwd', pwd).append('new_pwd', new_pwd).append('token', token);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpParams).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async fetchAvail_v1(idcar) {
      const httpparams = new HttpParams().append('request' , 'fetchAvail_v1').
      append('idcar' , idcar).
      append('id_requestor', this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      }); 
    }

    async fetchEventAgency(idagency) {
      const httpparams = new HttpParams().append('request' , 'fetchEventAgency').
      append('id_agency' , idagency).
      append('id_requestor', this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      }); 
    }

    async fetchKbis(id_agency) {
      const httpparams = new HttpParams().append('request' , 'fetchKbis').
      append('id_requestor' , this.glb.user.id).
      append('id_agency', id_agency);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      }); 
    }

    async checkout(token, amount, email) {
      const httpparams = new HttpParams().
      append('id_user' , this.glb.user.id).
      append('amount' , amount).
      append('email' , email).
      append('fname' , 'tocreate').
      append('lname' , 'to create').
      append('billing_adress' , 'adress_tocreate').
      append('card_brand' , token['card']['brand']).
      append('card_country' , token['card']['country']).
      append('card_cvc_check' , token['card']['cvc_check']).
      append('card_dynamic_last4' , token['card']['dynamic_last4']).
      append('card_exp_month' , token['card']['exp_month']).
      append('card_exp_year' , token['card']['exp_year']).
      append('card_funding' , token['card']['funding']).
      append('card_last4' , token['card']['last4']).
      append('card_name' , token['card']['name']).
      append('card_three_d_secure' , token['card']['three_d_secure']).
      append('card_tokenization_method' , token['card']['tokenization_method']).
      append('token_created' , token['created']).
      append('token_currency' , token['currency']).
      append('token_amount' , token['amount']).
      append('token_flow' , token['flow']).
      append('token_id' , token['id']).
      append('token_livemode' , token['livemode']).
      append('token_statement_descriptor' , token['statement_descriptor']).
      append('token_status' , token['status']).
      append('token_type' , token['type']).
      append('token_usage' , token['usage']).
      append('token_client_secret', token['client_secret']);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'checkout.php', httpparams).toPromise().then( resp => {
        console.log("db respo");
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      }); 
    }

    async review(car_id, booking_id, note) {

      const httpparams = new HttpParams().
      append('reviewerID' , this.glb.user.id).
      append('concernedID' , car_id).
      append('booking_id' , booking_id).
      append('rate' , note[1].note).
      append('rate_reception' , note[0].note).
      append('comment' , note[2].comment).
      append('typeConcerned', '1').
      append('request', 'review');

     return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      }); 
    }

    


    async fetchRib(id_agency) {
      const httpparams = new HttpParams().append('request' , 'fetchRib').
      append('id_requestor' , this.glb.user.id).
      append('id_agency', id_agency);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      }); 
    }
      
      

    async answerDemand(answer , dmID) {
      console.log(answer + ' ----- ' + dmID);
      const httpparams = new HttpParams().append('request' , 'answerDemande')
      .append('value' , answer).append('demandID' , dmID);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        if (resp['status'] === 'success') {
          this.glb.AgencyLogData.DemandesCount = resp['data'].length;
        }
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }
    
    async fetchDemands(agId) {
      const httpparams = new HttpParams().append('request' , 'fetchDemandes')
      .append('agency' , agId);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        if (resp['status'] === 'success') {
          this.util.debug('fetchDemands', resp);
          let counter = 0;
          resp['data'].forEach(element => {
            if (element['isread'] === '0') {
              counter += 1;
            }
          });
          this.glb.AgencyLogData.DemandesCount = counter;
        }
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });

    }

    async fetchPendingValidation() {
      const httpparams = new HttpParams().append('request' , 'fetchPendingValidation')
      .append('user_id' , this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async validationAgency(answer , dmID) {
      const httpparams = new HttpParams().append('request' , 'validationAgency')
      .append('value' , answer).append('demandID' , dmID).append('user_id', this.glb.user.id)
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async validationVehicle(answer , dmID) {
      const httpparams = new HttpParams().append('request' , 'validationVehicle')
      .append('value' , answer).append('demandID' , dmID).append('user_id', this.glb.user.id)
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async validationUser(answer , dmID) {
      const httpparams = new HttpParams().append('request' , 'validationUser')
      .append('value' , answer).append('demandID' , dmID).append('user_id', this.glb.user.id)
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

  
    

    async reserveCar(req) {
      const httpparams = new HttpParams().append('request' , 'bookCar')
      .append('iduser' , req.idClient).append('startdate' , req.startdate)
      .append('enddate' , req.enddate).append('idCar' , req.idCar)
      .append('unitPrice', req.unitPrice).append('starttime', req.starttime).append('endtime', req.endtime)
      .append('adress', req.adress).append('validPaiement', req.validPaiement)
      .append('com_platform', req.com_platform).append('com_agency', req.com_agency)
      .append('com_client', req.com_client).append('booking_status', req.booking_status)
      .append('booking_state', req.booking_state).append('rent_state', req.rent_state)
      .append('totalPrice' , req.totalprice).append('needConfirm' , req.car['needConfirm'])
      .append('idAgency', req.idAgency).append('guid_book', this.util.newGuid())
      .append('id_transaction', req.id_transaction).append('id_source', req.id_source)
      .append('car_model', req.car_model).append('car_brand', req.car_brand);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        return resp;
        console.log(resp);
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async confirmReserveCar(req) {
      const httpparams = new HttpParams().append('request' , 'confirmBookCar')
      .append('totalPrice' , req.totalprice).append('id_booking' , req.id_booking)
      .append('guid_book' , req.guid_book).append('validPaiement' , req.validPaiement)
      .append('booking_state', req.booking_state).append('rent_state', req.rent_state).append('id_transaction', req.id_transaction)
      .append('id_source', req.id_source).append('startdate', req.startdate)
      .append('starttime', req.starttime).append('enddate', req.enddate)
      .append('endtime', req.endtime);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        return resp;
        console.log(resp);
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async reserveCarOut(req) {
      const httpparams = new HttpParams().append('request' , 'bookCarOut')
      .append('iduser' , req.idClient).append('startdate' , req.startdate)
      .append('enddate' , req.enddate).append('idCar' , req.idCar)
      .append('unitPrice', req.unitPrice).append('starttime', req.starttime).append('endtime', req.endtime)
      .append('adress', req.adress).append('validPaiement', req.validPaiement)
      .append('com_platform', req.com_platform).append('com_agency', req.com_agency)
      .append('com_client', req.com_client).append('booking_status', req.booking_status)
      .append('booking_state', req.booking_state).append('rent_state', req.rent_state)
      .append('totalPrice' , req.totalprice).append('needConfirm' , req.car['needConfirm'])
      .append('idAgency', req.idAgency).append('guid_book', this.util.newGuid())
      .append('id_transaction', req.id_transaction).append('id_source', req.id_source)
      .append('car_model', req.car_model).append('car_brand', req.car_brand)
      .append('licenseRecto', req.licenseRecto).append('licenseVerso', req.licenseVerso)
      .append('lname', req.lname).append('fname', req.fname).append('adresse', req.adresse)
      .append('adressClient', req.adressClient).append('email', req.email)
      .append('licenseExp', req.licenseExp).append('tel', req.tel).append('agencyOwner', this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        return resp;
        console.log(resp);
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    generateOptionsList(data) {
      let res = '';
      res += data.clim ? '1' : '_'; res += ',';
      res += data.rv ? '1' : '_'; res += ',';
      res += data.gps ? '1' : '_'; res += ',';
      res += data.sb ? '1' : '_'; res += ',';
      res += data.lc ? '1' : '_'; res += ',_';
      return res;
    }

    async fetchSearchreq(id, req) {
      console.log(req.startdate);
      console.log(req.enddate);
      console.log(req.starttime);
      const httpparams = new HttpParams().append('request' , 'fetchsearchreq')
      .append('offset' , req.offset).append('startdate' , req.startdate)
      .append('lat' , req.lat).append('lon' , req.lon)
      .append('enddate' , req.enddate).append('starttime' , req.starttime)
      .append('endtime' , req.endtime).append('moteur' , req.filter.moteur)
      .append('pricemin' , req.filter.price.lower).append('pricemax' , req.filter.price.upper)
      .append('options' , this.generateOptionsList(req.filter)).append('user_id', id)
      .append('daysdif' , req.daysdif);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
        console.log("resp- fethcsearchreq");
        
      }).catch(err => {
        console.error(err);
        return false;
      });
    }


    async addHistoCar(id, car_id, start_date, end_date, start_hour, end_hour, options, daydiff, adress) {
      const httpparams = new HttpParams().append('request' , 'addCarHisto')
      .append('user_id', car_id)
      .append('car_id' , id)
      .append('start_date' , start_date)
      .append('end_date' , end_date)
      .append('start_hour' , start_hour)
      .append('end_hour' , end_hour)
      .append('options' , options)
      .append('daydiff' , daydiff)
      .append('adress', adress);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
        
        console.log(resp);
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async cancelBooking(id_booking, guid_booking, booking_state) {
      const httpparams = new HttpParams().append('request' , 'cancelBooking')
      .append('user_id', this.glb.user.id)
      .append('id_booking' , id_booking)
      .append('guid_booking',guid_booking)
      .append('booking_state', booking_state);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
        console.log(resp);
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async cancelBookingOut(id_booking, guid_booking, booking_state) {
      const httpparams = new HttpParams().append('request' , 'cancelBookingOut')
      .append('user_id', this.glb.user.id)
      .append('id_booking' , id_booking)
      .append('guid_booking',guid_booking)
      .append('booking_state', booking_state);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
        console.log(resp);
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async updateAccessH(data: {alldays: string, startdate: string, enddate: string, starttime: string, endtime: string}): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'updateAccessH')
      .append('agencyid' , this.glb.AgencyLogData.id)
      .append('alldays' , data.alldays)
      .append('startdate' , data.startdate)
      .append('enddate' , data.enddate)
      .append('starttime' , data.starttime)
      .append('endtime' , data.endtime);
      this.loading.presentLoading();
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        this.loading.dismissLoading();
        return resp;
      }).catch(err => {
        this.loading.dismissLoading();
        console.log(err);
        return false;
      });
    }



    async delBR(id_discount, id_agency): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'delbonreduction').
      append('id' , id_discount).
      append('id_agency' , id_agency).
      append('id_requestor' , this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        if (resp && resp.message === 'Success') {
          return true;
        } else {
          return false;
        }
      }).catch(err => {
        console.error(err);
        return false;
      });

    }


    async fetchBR(id: string, id_requestor: string): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'fetchbonreduction')
      .append('offset' , '0').append('agencyid' , id).
      append('id_requestor', id_requestor);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async addBR(request: string , data: any, id_agency: string): Promise<any> {
      let id = '0';
      if (request === 'update') {
        id = data.id;
      }
      const httpparams = new HttpParams().append('request' , 'addbonreduction')
      .append('for' , request).append('id' , id + '')
      .append('agencyid' , id_agency)
      .append('id_requestor', this.glb.user.id)
      .append('name' , data.name).append('value' , data.value)
      .append('type' , data.type).append('code' , data.code)
      .append('dated' , data.debut).append('datef' , data.fin).append('status' , data.status);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }


    async deleteUserAccount(index: string): Promise<any> {
      const httpparams = new HttpParams().
      append('request' , 'deleteUser').
      append('id_user' ,index ).
      append('id_requestor',this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async updateBRStatus(index: string): Promise<any> {
      const httpparams = new HttpParams().
      append('request' , 'updateBR').
      append('id_discount', index).
      append('id_requestor',this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    } 

    async deleteAgencyAccount(index: string): Promise<any> {
      const httpparams = new HttpParams().
      append('request' , 'deleteAgency').
      append('id_agency' ,index ).
      append('id_requestor',this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async addHistoricalLogIn(support, location, lang, login_type, os, os_version, browser, browser_version, user_agent, support_type): Promise<any> {
      const httpparams = new HttpParams().
      append('request' , 'addHistoricalLogIn').
      append('client_id' ,this.glb.user.id).
      append('role' ,this.glb.user.role).
      append('location' , location).
      append('support' ,support).
      append('support_type' ,support_type).
      append('login_type', login_type).
      append('os', os).
      append('os_version', os_version).
      append('browser', browser).
      append('browser_version', browser_version).
      append('user_agent', user_agent).
      append('user_language', lang).
      append('id', this.glb.user.session_guid);

      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async updateHistoricalLogIn(): Promise<any> {
      const httpparams = new HttpParams().
      append('request' , 'updateHistoricalLogIn').append('id', this.glb.user.session_guid);  
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async de_activateAccount(index: string): Promise<any> {
      const httpparams = new HttpParams().
      append('request' , 'de_activateUser').
      append('id_user' ,index).
      append('id_requestor',this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async de_activateAgency(index: string): Promise<any> {
      const httpparams = new HttpParams().
      append('request' , 'de_activateAgency').
      append('id_agency' ,index).
      append('id_requestor',this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async updateRibInfo(): Promise<any> {
      let request = "";
      let id = "";
      let id_agency ;
      
      if (this.glb.rib_modify.length === 0) {
        request = "addRib";
        id ="";
      } else {
        request = "updateRib"
        id = this.glb.rib_modify['id'];
      }
      if (this.glb.ifAdmin(this.glb.user.role)){
        id_agency = this.glb.agency_modify['id'];
     } else {
        id_agency =this.glb.AgencyLogData.id;
     }

      const httpparams = new HttpParams().
      append('request' , request).
      append('id' , id).
      append('pay_choice' ,this.glb.rib_modify['pay_choice']).
      append('bank' ,this.glb.rib_modify['bank']).
      append('reference' ,this.glb.rib_modify['reference']).
      append('account_n' ,this.glb.rib_modify['account_n']).
      append('iban' ,this.glb.rib_modify['iban']).
      append('id_agency' ,id_agency).
      append('id_requestor',this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async updateKbisInfo(LiImgPaths: any): Promise<any> {
      let request = "";
      let id = "";
      let owner_id = "";
      let id_agency ;
      
      if (this.glb.kbis_modify.length === 0 && this.glb.ifAdmin(this.glb.user.role)) {
        request = "addKbis";
        id ="";
      } else {
        request = "updateKbis"
        id = this.glb.kbis_modify['id'];
      }

      if (this.glb.ifAdmin(this.glb.user.role)){
         id_agency = this.glb.agency_modify['id'];
      } else {
         id_agency =this.glb.AgencyLogData.id;
      }

      const httpparams = new HttpParams().
      append('request' , request).
      append('id' , id).
      append('kbis_ref' ,this.glb.kbis_modify['kbis_ref']).
      append('tva' ,this.glb.kbis_modify['tva']).
      append('creationDate' ,this.glb.kbis_modify['creationDate']).
      append('adresse' ,this.glb.kbis_modify['adresse']).
      append('picture_recto' , LiImgPaths['rectoimg']).
      append('picture_verso' , LiImgPaths['versoimg']).
      append('id_agency' ,id_agency).
      append('id_requestor',this.glb.user.id);
      console.log(this.glb.kbis_modify);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async fetchProfilInfo(index: string): Promise<any> {
      const httpparams = new HttpParams().
      append('request' , 'fetchProfil').
      append('id_user' ,index).
      append('id_requestor',this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async fetchCars(id: string, userid: string): Promise<any> {
      console.log(userid);
      const httpparams = new HttpParams().append('request' , 'fetchCars').append('agencyid' , id).append('userid',userid);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async fetchWallet(id: string, userid: string): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'fetchWallet').append('agencyid' , id).append('id_requestor',userid);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async fetchHistoricalWallet(id: string, userid: string, id_wallet: string): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'fetchHistoricalWallet').append('id_wallet', id_wallet).append('agencyid' , id).append('id_requestor',userid);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async fetchBookingAgency(id: string, userid: string): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'fetchBookingAgency').append('agencyid' , id).append('id_requestor',userid);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async fetchCarsUsers(id: string, userid: string): Promise<any> {
      console.log(userid);
      const httpparams = new HttpParams().append('request' , 'fetchCarsUser').append('user_id' , id).append('requestor_id',userid);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async fetchAgencies(id: string, requesotr: string): Promise<any> {
      //console.log(userid);
      const httpparams = new HttpParams().append('request' , 'fetchAgencies').append('id_agency' , id).append('id_requestor',requesotr);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async fetchAgenciesRelatedData(id: string, requesotr: string): Promise<any> {
      //console.log(userid);
      const httpparams = new HttpParams().append('request' , 'fetchAgenciesRelatedData').append('id_agency' , id).append('id_requestor',requesotr);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.log("hello");
        console.error(err);
        return false;
      });
    }

    

    async fetchAgenciesUser(id: string, requesotr: string): Promise<any> {
      //console.log(userid);
      const httpparams = new HttpParams().append('request' , 'fetchAgenciesUser').append('user_id' , id).append('id_requestor',requesotr);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async fetchUsers(userid: string): Promise<any> {
      console.log(userid);
      const httpparams = new HttpParams().append('request' , 'fetchUsers').append('userid',userid);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    getStorage(key) {
      return this.logserv.getStorage(key);
    }
    async uploadLicence(file: any): Promise<any> {
      return await this.http.post(this.glb.hostServer + 'uploadLicense.php',  file).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }
    async uploadProfilePic(formdata: any): Promise<any> {
      return await this.http.post(this.glb.hostServer + 'uploadProfilePicture.php',  formdata).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      }).finally( () => {

      });
    }

    async startLocnew(id , pictures , clientID, inv_step, type_book): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'startLoc').append('clientID' , clientID)
      .append('idbooking' , id).append('fll' , pictures['fll']).append('flr' , pictures['flr'])
      .append('bll' , pictures['bll']).append('blr' , pictures['blr']).append('inside', pictures['inside'])
      .append('inv_step', inv_step).append('type_book', type_book);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async endLocnew(id , pictures , clientID, inv_step, type_book): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'endLoc').append('clientID' , clientID)
      .append('idbooking' , id).append('fll' , pictures['fll']).append('flr' , pictures['flr'])
      .append('bll' , pictures['bll']).append('blr' , pictures['blr']).append('inside', pictures['inside'])
      .append('inv_step', inv_step).append('type_book', type_book);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async clientLocResponse(response , id): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'clientLocResponse')
      .append('bookid' , id).append('value' , response).append('type_book', '0');
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async clientEndLocResponse(response , id): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'clientEndLocResponse')
      .append('bookid' , id).append('value' , response).append('type_book', '0');
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async startLoc(id , vid): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'startLoc')
      .append('idbooking' , id).append('vid' , vid);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }
    async getMLocs(): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'getMlocs')
      .append('iduser' , this.glb.AgencyLogData.id)
      .append('id_requestor', this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async getMELocs(): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'getMElocs')
      .append('iduser' , this.glb.AgencyLogData.id)
      .append('id_requestor', this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async validateAccount(token): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'validateAccount')
      .append('token' , token);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async getALocs(): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'getAlocs')
      .append('iduser' , this.glb.user.id)
      .append('id_requestor', this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    countNotifs(notifs: any , type?) {
      let unread = 0;
      let notifications = [];
      notifs.forEach(element => {
        let notification = {};
        if (element['read_stat'] !== '2') {
          let notification = {};
          if (element['read_stat'] === '0') {
            unread += 1;
          }
          notification['id'] = element['id'];
          notification['ntype'] = element['ntype'];
          notification['target'] = element['target'];
          notification['title'] = element['title'];
          notification['desc'] = element['message'];
          notification['read'] = this.isRead(element['read_stat']);
          notification['clientTar'] =element['clientTar'];
          notification['icon'] = notification['read'] ? 'checkmark-circle' : 'radio-button-off';
          notifications.push(notification);
        }
      });

      if (type === 1) {
        this.glb.notifications = notifications;
        this.glb.unreadNotif = unread;
      } else {
        this.glb.AgencyLogData.notificationDat = notifications;
        this.glb.AgencyLogData.notificationsCount = unread;
      }
    }

    async fetchDashNotifications(id) {
      const httpparams = new HttpParams()
      .append('request' , 'fetchNotifications').append('id' , id).append('type', '3');
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php',  httpparams ).toPromise().then( resp => {
        this.countNotifs(resp.data , 2);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }


    async setRead(id: string) {
      const httpparams = new HttpParams()
      .append('request' , 'setNotiRead').append('id' , id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php',  httpparams ).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }
    isRead(val: string) {
      return val === '1' ? true : false;
    }
    async fetchNotifications(type: string) {
      const httpparams = new HttpParams()
      .append('request' , 'fetchNotifications').append('id' , this.glb.user.id).append('type' , type);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php',  httpparams ).toPromise().then( resp => {
        this.countNotifs(resp.data, 1);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    pushNotification() {

    }

    async dbUpdateCar(data: any, picsList:any, optionsList:any, optionsRenting: any, id:string): Promise<boolean> {
      const httpparams = new HttpParams()

      .append('marque' , data[0].marque[0]).append('piclist' , picsList)
      .append('id' , id)
      .append('model' , data[0].model[0])
      .append('engine' , data[1].carburant[0])
      .append('vitesse' , data[1].boitevitesse)
      .append('options' , optionsList)
      .append('address' , data[3].address[0])
      .append('lat' , data[3].lat)
      .append('lon' , data[3].lon)
      .append('prix' , data[4].prix[0])
      .append('needConfirmation' , data[2].needConf)
      .append('vin', data[0].matricule)
      .append('Km', data[6].Km)
      .append('Km_price', data[6].Km_price)
      .append('license_seniority', data[6].license_seniority)
      .append('foreign_accepted', data[6].foreign_accepted)
      .append('caution', data[6].caution)
      .append('caution_value', data[6].caution_value)
      .append('accepted_peices', optionsRenting)
      .append('request' , 'updateCar');

      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        if (resp.status === 'success') {
          return true;
        } else {
          return false;
        }
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async dbUpdateCarLic(data: any, id:string): Promise<boolean> {
      this.util.debug('dbUpdateCarLic',data);
      const httpparams = new HttpParams()

      .append('insu_Id' , data[1].insu_id)
      .append('vehicle_id' , id)
      .append('requestor_id', this.glb.user.id)
      .append('insu_exp' , data[1].insu_exp)
      .append('insu_pic' , data[1].picsMeta['insurance'][3].replace(this.glb.hostServer, ''))
      .append('control_id' , data[2].control_id)
      .append('control_pic' , data[2].picsMeta['control'][3].replace(this.glb.hostServer, ''))
      .append('control_exp' , data[2].control_exp)
      .append('car_doc_id' , data[0].car_doc_id)
      .append('car_pic' , data[0].picsMeta['license'][3].replace(this.glb.hostServer, ''))
      .append('request' , 'dbUpdateCarLic');

      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        if (resp.status === 'success') {
          return true;
        } else {
          return false;
        }
      }).catch(err => {
        console.error(err);
        return false;
      });
    }


    async dbconfirmAddCar(data: any, picsList:any, optionsList:any, optionsRenting: any, guid_car: any): Promise<boolean> {
      const httpparams = new HttpParams()

      .append('marque' , data[0].marque[0]).append('piclist' , picsList)
      .append('id' , this.glb.AgencyLogData.id)
      .append('model' , data[0].model[0])
      .append('engine' , data[1].carburant[0])
      .append('vitesse' , data[1].boitevitesse)
      .append('options' , optionsList)
      .append('address' , data[3].address[0])
      .append('prix' , data[4].prix[0])
      .append('needConfirmation' , data[2].needConf)
      .append('request' , 'addCar')
      .append('Km', data[6].Km)
      .append('Km_price', data[6].Km_price)
      .append('license_seniority', data[6].license_seniority)
      .append('caution', data[6].caution)
      .append('caution_value', data[6].caution_value)
      .append('foreign_accepted', data[6].foreign_accepted)
      .append('accepted_peices', optionsRenting)
      .append('vin', data[0].matricule)
      .append('lat', data[3].lat)
      .append('lon', data[3].lon)   
      .append('guid_car', guid_car);

      /*.append('request' , 'addCar').append('id' , this.glb.user.id)
      .append('brand' , data[0].marque[0]).append('model' , data[0].modele[0])
      .append('engine' , data.bemail).append('cpays' , data.cpays)
      .append('bmobile' , data.bmobile).append('address' , data.address);*/
      
      
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        if (resp.status === 'success') {
          return true;
        } else {
          return false;
        }
      }).catch(err => {
        console.error(err);
        return false;
      });
    }
    async dbcreateAgency(data: any, guid_agency: any): Promise<boolean> {
      const httpparams = new HttpParams()
      .append('request' , 'createAgency').append('id' , this.glb.user.id).append('guid_agency', guid_agency)
      .append('nom' , data.nom).append('cdate' , data.cdate)
      .append('bemail' , data.bemail).append('cpays' , data.cpays)
      .append('bmobile' , data.bmobile).append('address' , data.address);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        if (resp.status === 'success') {
          this.glb.hasAgency = true;
          this.glb.AgencyLogData.loggedin = true;
          this.glb.AgencyLogData.id = resp.data;
          this.glb.AgencyLogData.bemail = data.bemail;
          this.glb.AgencyLogData.name = data.nom;
          this.glb.AgencyLogData.data = resp.data;
          this.glb.AgencyLogData.status = 0; 
          return true;
        } else {
          return false;
        }
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async FetchAcc(): Promise<any> {
      const httpparams = new HttpParams()
      .append('request' , 'fetchAgency').append('id' , this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async FetchCarToBookOut(id): Promise<any> {
      const httpparams = new HttpParams()
      .append('request' , 'FetchCarToBookOut').append('id_agency' , id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async FetchCarLicense(vehicle_id): Promise<any> {
      const httpparams = new HttpParams()
      .append('request' , 'FetchCarLicense').append('id' , this.glb.user.id).append('vehicle_id', vehicle_id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async setAccParams(params: any) {
      console.log('second step');
      const httpparams = new HttpParams()
      .append('request' , 'setParams').append('id' , this.glb.user.id)
      .append('demandlocation' , params.demandlocation).append('redemandlocation' , params.redemandlocation)
      .append('locAccept' , params.locAccept).append('loccancel' , params.loccancel)
      .append('locrappel' , params.locrappel).append('emailpromo' , params.emailpromo);
      return await this.http.post(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async fetchBooking(car_id: string, id_agency: string): Promise<any>  {
      const httpparams = new HttpParams()
      .append('request' , 'fetchBooking')
      .append('id_requestor' , this.glb.user.id)
      .append('id_agency', id_agency)
      .append('id_car', car_id);  
      return await this.http.post(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async getAccParams(): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'getParams').append('id' , this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        console.log('getAccParams');
        return resp;
      }).catch(err => {
        console.error(err);
        this.loading.dismissLoading();
        return false;
      });
    }

    async createAccParams(): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'createAccParams').append('id' , this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp.data;
      }).catch(err => {
        console.error(err);
        this.loading.dismissLoading();
        return false;
      });
    }

    convertToBool(val: string) {
      if (val === '1') {
        return true;
      } else {
        return false;
      }
    }


    async finishVerifyAcc(data: any , pics: any, user: any) {
      const httpparams = new HttpParams()
      .append('id_requestor',this.glb.user.id)
      .append('request' , 'verifyAcc')
      .append('id_user' , user.id)
      .append('Lid' , data.lid)
      .append('dateo' , data.dateo)
      .append('payso' , data.payso)
      .append('imgrecto' , pics.rectoimg)
      .append('imgverso' , pics.versoimg);
      return await this.http.post(this.glb.hostServer + 'core.php',  httpparams).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

 

    async updateAgencyinfos(agencytmp: any) {
      const httpparams = new HttpParams()
      .append('request' , 'updateAgencyinfos')
      .append('id' , this.glb.AgencyLogData.id )
      .append('businessEmail', this.glb.AgencyLogData.bemail)
      .append('bmobile' , this.glb.AgencyLogData.data['bmobile'])
      .append('name' , this.glb.AgencyLogData.name)
      .append('picture', this.glb.AgencyLogData.data['picture'])
      .append('address', this.glb.AgencyLogData.data['address'])
      .append('id_requestor', this.glb.user.id)
      await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php',  httpparams)
      .toPromise().then( (resp) => {
        return true;
      }).catch( err => {
        console.log(err);
      }).finally( () => {
      });
    }

    async updatePassword(password: any, id: any) {
      const httpparams = new HttpParams()
      .append('request' , 'updatePassword')
      .append('id' , id )
      .append('password',password )
      .append('id_requestor', this.glb.user.id)
      await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php',  httpparams)
      .toPromise().then( (resp) => {
        return resp;
      }).catch( err => {
        console.log(err);
      }).finally( () => {
      });
    }

    async updateprofileinfos(usertmp: UserData) {
      const httpparams = new HttpParams()
      .append('request' , 'profileUpdate')
      .append('id_user' , usertmp.id )
      .append('fname', usertmp.fname)
      .append('lname' , usertmp.lname)
      .append('username' , usertmp.username )
      .append('phone', usertmp.phoneNumber)
      .append('pic' , this.glb.user.pic)
      .append('dob' , usertmp.dob)
      .append('pob' , usertmp.pob)
      .append('address' , usertmp.address)
      .append('pays' , usertmp.country)
      .append('ville', usertmp.ville)
      .append('codeP' , usertmp.codeP)
      .append('propos' , usertmp.propos)
      .append('id_requestor', this.glb.user.id)
      await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php',  httpparams)
      .toPromise().then( (resp) => {
        console.log(resp.data['pass']);
        //this.glb.user = usertmp;
        //this.glb.user.password = resp.data['password'];
        this.alertt.presentAlert('Success' , 'Profile info has been updated successfully');
      }).catch( err => {
        console.log(err);
      }).finally( () => {
      });
    }
}
