import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { UserData } from '../interfaces/user-data';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from './loading.service';
@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
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
    userStatus: ''
  };

  isLoading = false;
  todaysDate = new Date();
  //public hostServer = 'http://localhost/bridgedz/';
  //public hostServer = 'https://bridgedz.000webhostapp.com/';
  public hostServer = '';

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
      userStatus: ''
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
}
