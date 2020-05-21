import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { UserData } from '../interfaces/user-data';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from './loading.service';
import { role_user}  from '../interfaces/role_user';
import { account_status}  from '../interfaces/account_status';
import { Label } from 'ng2-charts';
import {TranslateService, TranslatePipe, TranslateModule} from '@ngx-translate/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarView} from 'angular-calendar';


@Injectable({
  providedIn: 'root'
})


export class GlobalsService {


  isMainPage = true;
  isSearchPage = false;
  isDashbPage = false;
  searchQuery = {
    address: '',
    lat:'',
    lon:'',
    startdate: '',
    enddate: '',
    starttime: '',
    endtime: ''
  };
  sync = 0;
  hasAgency = false;
  AgencyLogData = {
    loggedin: false,
    notificationsCount: 0,
    DemandesCount: 0,
    demandeLoc: [],
    notificationDat: [],
    id: '',
    name: '',
    bemail: '',
    status: 0,
    pic: '',
    data: []
  };
  daysdif = 1;
  event_agency=[];
  prevAction = '';
  prevBook = {};
  isViewCars = false;
  users =[];
  user_modify =[];
  bookings =[];
  booking_modify=[];
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
  notificationDat: [];
  selectedDays=[];
  unreadNotif = 0;
  car_perf_display = [];
  car_perf = [];
  booking_state = {
    done: 0,
    cancled: 0,
    waiting_for_validation: 0,
    verified :0,
    on_going :0
  };
  booking_state_c= {
    done: '',
    cancled: '',
    waiting_for_validation: '',
    verified :'',
    on_going :'',
  }

  summariez_info = {
    rented_car : 0,
    free_car : 0,
    real_balance : 0,
    theo_balance : 0,
  }
  barChartLabels: Label[] = ['MONTH.YEAR_BEFOR','MONTH.JANUARY', 'MONTH.FEBRUARY', 'MONTH.MARCH', 'MONTH.APRIL', 'MONTH.MAI', 'MONTH.JUNE', 'MONTH.JULY', 'MONTH.AUGUST','MONTH.SEPTMBER','MONTH.OCOTOBER','MONTH.NOVOMBER','MONTH.DECEMBER'];
  barChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], backgroundColor: '#4e73df', hoverBackgroundColor: '#6610f2', label: 'WALLET.INSIDE_BRIDGY' },
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], backgroundColor: '#858796', hoverBackgroundColor: '#5a5c69',  label: 'WALLET.OUTSIDE_BRIDGY' }
  ];
  gaugeLabel_rent = 'INDICATOR.NBR_RENTING';
  gaugeLabel_price = 'INDICATOR.PRICE_MEAN';
  pieChartLabels: Label[] = [['WALLET.INSIDE_BRIDGY'], ['WALLET.OUTSIDE_BRIDGY']];
  events=[];

  accparams: any = { 
    demandlocation: [false , false , false],
    redemandlocation: [false , false , false],
    locAccept: [false , false , false],
    loccancel: [false , false , false],
    locrappel: [false , false , false],
    emailpromo: [false , false , false]
  };
  toReload = 0;

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
    status_verified: '',
    session_guid: '',
    licenseId: '',
    dlicencePaye: '',
    dlicenceDate: '',
    licenseRecot: '',
    licenseVerso: ''

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
      notificationDat: [],
      id: '',
      name: '',
      pic: '',
      status: 0,
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
      status_verified: '',
      role: '',
      session_guid: '',
      licenseId: '',
      dlicencePaye: '',
      dlicenceDate: '',
      licenseRecot: '',
      licenseVerso: ''
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

  resetAgencyData(){
    this.rib_modify = [];
    this.ribs = [];
    this.kbis_modify = [];
    this.kbis = [];
    this.event_agency = [];
    this.events = [];
    this.cars = [];
    this.car_modify = [];
    this.wallet = [];
    this.bookings = [];
    this.booking_modify = [];
    this.discounts = [];
    this.discount_modify = [];
    this.cars = [];
    this.car_modify = [];

      
  

  }

  resetDashBoard(){
    this.summariez_info.free_car = 0;
    this.summariez_info.rented_car = 0;
    this.summariez_info.theo_balance = 0;
    this.summariez_info.real_balance = 0;
    this.booking_state.cancled = 0;
    this.booking_state.done = 0;
    this.booking_state.on_going = 0;
    this.booking_state.verified = 0;
    this.booking_state.waiting_for_validation = 0;
    this.booking_state_c.cancled = '';
    this.booking_state_c.done = '';
    this.booking_state_c.on_going ='';
    this.booking_state_c.verified = '';
    this.booking_state_c.waiting_for_validation ='';

    for (let i=0; i<this.barChartData[0]['data'].length ; i++){
      this.barChartData[0]['data'][i] = 0;
    }
  }

  resetAdmin(){
    this.resetAgencyData();
    this.users = [];
    this.user_modify = [];
    this.agencies = [];
    this.agency_modify = [];
  } 


  generateURLPicture(urlImage: string){
    if (urlImage.includes(this.hostServer) === true) {
      var newURL = urlImage.replace(this.hostServer,'');   
      return newURL;
  }
  }

  }




