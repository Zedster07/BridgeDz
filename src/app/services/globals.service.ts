import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { UserData } from '../interfaces/user-data';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from './loading.service';
import { role_user}  from '../interfaces/role_user';
import { account_status}  from '../interfaces/account_status';


@Injectable({
  providedIn: 'root'
})


export class GlobalsService {


  isMainPage = true;
  isSearchPage = false;
  isDashbPage = false;
  searchQuery = {
    address: '',
    startdate: '',
    enddate: '',
    starttime: '',
    endtime: ''
  };

  hasAgency = false;
  AgencyLogData = {
    loggedin: false,
    notificationsCount: 2,
    DemandesCount: 0,
    demandeLoc: [],
    id: '',
    name: '',
    bemail: '',
    data: []
  };

  prevAction = '';
  prevBook = {};
  myCars = [];
  isViewCars = false;
  users =[];
  user_modify =[];
  agencies  =[];
  agency_modify =[];
  cars  =[];
  car_modify =[];
  kbis =[];
  kbis_modify = [];
  ribs =[];
  rib_modify = [];
  wallet=[];
  discounts=[];
  discount_modify=[];
  isViewAgency = false;
  permis=[];
  notifications = [];
  unreadNotif = 0;
  public user: UserData = {
    type: '',
    id: '',
    fname: '',
    lname: '',
    username: '',
    email: '',
    phoneNumber: '',
    pic: '',
    password: '',
    dob: '',
    pob: '',
    address: '',
    country: '',
    ville: '',
    codeP: '',
    propos: '',
    userStatus: '',
    role: '',
    session_guid: '',
  };
  currentLang ='';
  isLoading = false;
  todaysDate = new Date();
  public hostServer = 'http://localhost:8081/bridgedz/';
  //public hostServer = 'https://bridgedz.000webhostapp.com/';
  //public hostServer = '';

  constructor(
    public popover: PopoverController,
    private http: HttpClient,
    private loading: LoadingService) {

      this.searchQuery.starttime = '12:00 AM';
      this.searchQuery.endtime = '12:00 PM';
    // tslint:disable-next-line: max-line-length
      this.searchQuery.startdate = this.todaysDate.getFullYear() + '/' + (this.todaysDate.getMonth() + 1) + '/' + (this.todaysDate.getDate());
    // tslint:disable-next-line: max-line-length
      this.searchQuery.enddate = this.todaysDate.getFullYear() + '/' + (this.todaysDate.getMonth() + 1) + '/' + (this.todaysDate.getDate() + 1);

  }

  globalLoading(val: boolean) {
    if (!this.isLoading && val) {
      this.isLoading = val;
      this.loading.presentLoading();
    } else {
      this.isLoading = val;
      this.loading.dismissLoading();
    }
  }

  resetData() {
    this.hasAgency = false;
    this.AgencyLogData = {
      loggedin: false,
      notificationsCount: 0,
      DemandesCount: 0,
      demandeLoc: [],
      id: '',
      name: '',
      bemail: '',
      data: []
    };
    this.user = {
      type: '',
      id: '',
      fname: '',
      lname: '',
      username: '',
      email: '',
      phoneNumber: '',
      pic: '',
      password: '',
      dob: '',
      pob: '',
      address: '',
      country: '',
      ville: '',
      codeP: '',
      propos: '',
      userStatus: '',
      role: '',
      session_guid: '',
    };
  }
  correctPassword( pass: string ) {
    if ( pass === '' ) {
      return 0;
    } else if ( pass.length < 6 ) {
      return 1;
    } else {
      return 2;
    }
  }

  validateEmail(email: string) {
    const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return re.test(String(email).toLowerCase());
  }

  validatePhone(phone: string) {
    const re = /^(?:0|\(?\+213\)?\s?|00213\s?)[1-79](?:[\.\-\s]?\d\d){4}/;
    return re.test(String(phone));
  }

  ifAdmin(role: string) {
    if (parseInt(role) === role_user.admin){
      return true;
    } else {
      return false;
    }  
  } 

  ifAgency(role: string) {
    if (parseInt(role) === role_user.agency){
      return true;
    } else {
      return false;
    }  
  }

  ifClient(role: string) {
    if (parseInt(role) === role_user.client){
      return true;
    } else {
      return false;
    }  
  }




  generateURLPicture(urlImage: string){
    if (urlImage.includes(this.hostServer) === true) {
      var newURL = urlImage.replace(this.hostServer,'');   
      return newURL;
  }
  }

  }




