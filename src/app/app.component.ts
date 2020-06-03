import { Component , ViewChild } from '@angular/core';

import { Platform, ModalController, PopoverController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoginService } from 'src/app/services/login.service';
import { DbinteractionsService } from './services/dbinteractions.service';
import { GlobalsService } from './services/globals.service';
import { AgencyModalPage } from './modals/agency-modal/agency-modal.page';
import { ClientMenuListComponent } from './client/client-menu-list/client-menu-list.component';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import { GeolocService } from './services/geoloc.service';
import { UtilService } from './services/util.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent   {
  rangeSettings = {
    lower: 500,
    upper: 1500
  };
  @ViewChild('finDate' , {static: true} ) finDate;
  @ViewChild('debutDate' , {static: true} ) debutDate;
  todaysDate = new Date();

  strart_date = new Date();
  end_date = new Date();

  cars = [];
  daysdif = 1;
  offset = '0';
  searchFilter = {
    price: {
      lower: 0,
      upper: 1500},
    moteur: 'all',
    clim: false,
    rv: false,
    gps: false,
    sb: false,
    lc: false
  };
  isLoading = true;
  address = '';
  searchResults = [];
  geo = false;

  myDate = this.todaysDate.getDate() + '/' + (this.todaysDate.getMonth() + 1) + '/' +this.todaysDate.getFullYear();
  disabledDates_start: Date[] = [
  ];
  disabledDates_end : Date[] = [
  ];
  debutDateStr = this.todaysDate.getFullYear() + '/' + (this.todaysDate.getMonth() + 1) + '/' + (this.todaysDate.getDate())  ;
  finDateStr =  this.todaysDate.getFullYear() + '/' + (this.todaysDate.getMonth() + 1) + '/' + (this.todaysDate.getDate() + 3)  ;
  timePickerObj: any = {
    inputTime: '11:01 PM', // for 12 hour time in timePicker
    timeFormat: '', // default 'hh:mm A'
    setLabel: 'Select', // default 'Set'
    closeLabel: 'Fermer', // default 'Close'
    titleLabel: 'Selectioner le temps', // default 'Time'
    clearButton: false, // default true
    btnCloseSetInReverse: true, // default false
    momentLocale: 'pt-BR', //  default 'en-US'
    btnProperties: {
        expand: '', // "block" | "full" (deafault 'block')
        fill: '', // "clear" | "default" | "outline" | "solid" 
                 // (deafault 'solid')
        size: '', // "default" | "large" | "small" (deafault 'default')
        disabled: '', // boolean (default false)
        strong: '', // boolean (default false)
        color: ''
        // "primary", "secondary", "tertiary", "success", 
        // "warning", "danger", "light", "medium", "dark" , 
        // and give color in string (default 'primary')
      }
    };
  datePickerObj: any = {
    fromDate: new Date(), // default null
    toDate: new Date('2021-12-28'), // default null
    showTodayButton: true, // default true
    closeOnSelect: true, // default false
    setLabel: 'Select',  // default 'Set'
    todayLabel: 'Aujourd\'hui', // default 'Today'
    closeLabel: 'Fermer', // default 'Close'
    disabledDates: this.disabledDates_start, // default []
    titleLabel: 'Selectionner une Date', // default null
    monthsList: ["Jan", "Fev", "Mar", "Avr", "May", "Juin", "Juillet", "Aug", "Sept", "Oct", "Nov", "Dec"],
    weeksList: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    dateFormat: 'YYYY-MM-DD', // default DD MMM YYYY
    clearButton : false , // default true
    momentLocale: 'en-US', // Default 'en-US'
    yearInAscending: true, // Default false
    btnCloseSetInReverse: true, // Default false
    btnProperties: {
      expand: 'block', // Default 'block'
      fill: '', // Default 'solid'
      size: '', // Default 'default'
      disabled: '', // Default false
      strong: '', // Default false
      color: '' // Default ''
    },


    
    arrowNextPrev: {
      nextArrowSrc: 'assets/images/arrow_right.svg',
      prevArrowSrc: 'assets/images/arrow_left.svg'
    }, // This object supports only SVG files.
    highlightedDates: [
    //{ date: new Date('2019-09-10'), color: '#ee88bf', fontColor: '#fff' },
    //{ date: new Date('2019-09-12'), color: '#50f2b1', fontColor: '#fff' }
    ], // Default [],
    isSundayHighlighted : {
    fontColor: '#ee88bf' // Default null
    } // Default {}
  };

  datePickerObj_end: any = {
    inputDate: new Date('2018-08-10'), 
    fromDate: new Date(), // default null
    toDate: new Date('2021-12-28'), // default null
    showTodayButton: true, // default true
    closeOnSelect: true, // default false
    setLabel: 'Select',  // default 'Set'
    todayLabel: 'Aujourd\'hui', // default 'Today'
    closeLabel: 'Fermer', // default 'Close'
    disabledDates: this.disabledDates_end, // default []
    titleLabel: 'Selectionner une Date', // default null
    monthsList: ["Jan", "Fev", "Mar", "Avr", "May", "Juin", "Juillet", "Aug", "Sept", "Oct", "Nov", "Dec"],
    weeksList: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    dateFormat: 'YYYY-MM-DD', // default DD MMM YYYY
    clearButton : false , // default true
    momentLocale: 'en-US', // Default 'en-US'
    yearInAscending: true, // Default false
    btnCloseSetInReverse: true, // Default false
    btnProperties: {
      expand: 'block', // Default 'block'
      fill: '', // Default 'solid'
      size: '', // Default 'default'
      disabled: '', // Default false
      strong: '', // Default false
      color: '' // Default ''
    },


    
    arrowNextPrev: {
      nextArrowSrc: 'assets/images/arrow_right.svg',
      prevArrowSrc: 'assets/images/arrow_left.svg'
    }, // This object supports only SVG files.
    highlightedDates: [
    //{ date: new Date('2019-09-10'), color: '#ee88bf', fontColor: '#fff' },
    //{ date: new Date('2019-09-12'), color: '#50f2b1', fontColor: '#fff' }
    ], // Default [],
    isSundayHighlighted : {
    fontColor: '#ee88bf' // Default null
    } // Default {}
  };


  myTimedbt = '08:00';
  myTimefin = '08:00';
  constructor(
    private db: DbinteractionsService,
    public glb: GlobalsService ,
    public modalController: ModalController,
    public popoverController: PopoverController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    public geoloc: GeolocService,
    private statusBar: StatusBar,
    public loginServ: LoginService,
    private route: Router,
    translate: TranslateService,
    private util : UtilService,

  ) {
    this.initializeApp();
    if ( this.loginServ.isLoggedIn() ) {
      this.loginServ.reloadUserData();
    }
    translate.addLangs(['en', 'fr', 'ar']);
    translate.setDefaultLang('ar');
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    this.glb.currentLang = browserLang.match(/en|fr|ar|br/) ? browserLang : 'en';
    translate.use(this.glb.currentLang);

  }
  onScroll(event) {
  }

  LoginAct() {
    if (this.loginServ.isLoggedIn()) {
      this.route.navigate(['client']);
    } else {
      this.route.navigate(['login']);
    }
  }

  async showAgencyModal() {
    const modal = await this.modalController.create({
      component: AgencyModalPage,
      componentProps: {
        type: ''
      }
    });
    return await modal.present();
  }
  async presentPopover(ev: any) {
    const pop = await this.popoverController.create({
      component: ClientMenuListComponent,
      event: ev,
      translucent: false,
    });
    return await pop.present();
  }

  myFunction() {
    if (this.glb.sync){
      this.util.debug('this.glb.sync myFunction', this.glb.sync);
      this.datePickerObj_end.disabledDates = [];
      this.datePickerObj_end.highlightedDates = [];
      this.disableDate( new Date(this.glb.searchQuery.startdate));
      this.glb.daysdif = 1;
      this.strart_date = new Date(this.glb.searchQuery.startdate);
    }
  }

  myFunction_time(){
    this.glb.sync = true;
  }

  myFunction_time_end(){
    if (!this.glb.sync){
       this.updateResult();
   }
  }
  myFunction_end() {

    if (this.glb.sync){
      const debutTimestamp = this.strart_date.getTime();
      const finTimestamp_ = new Date(this.glb.searchQuery.enddate);
      const finTimestamp = finTimestamp_.getTime();
      if (debutTimestamp > finTimestamp) {
      } else {
        const ms = finTimestamp - debutTimestamp;
        let daysdif = ms / 1000;
        daysdif = daysdif / 60;
        daysdif = daysdif / 60;
        daysdif = daysdif / 24;
        this.glb.daysdif = daysdif;
      }
      if (this.glb.daysdif > 0 && this.glb.daysdif < 1){
        this.glb.daysdif = 1;
      }
    this.updateResult();
    } 
  } 

  
  disableDate(start_date){
    let current_year = this.util.getCurrentYearNumber();
    let current_month = this.util.getCurrentMonthNumber();
    let current_day = this.util.getCurrentDayNumber();

    var temp = start_date;
    temp.setDate(start_date.getDate()+1);

    let year = this.util.getYearNumber(temp);
    let month = this.util.getMonthNumber(temp);
    let day = this.util.getDayNumber(temp);
    
    this.glb.searchQuery.enddate = year + '/' + (month ) + '/' + day;

    let max_day = 31;
    let max_month = 12;

    if (current_year === year){
      if (current_month === month){
        while (current_day < day){
          this.datePickerObj_end.disabledDates.push(new Date(current_year, current_month -1 , current_day));
          current_day++;
        }
      } else {
        for (let i = current_month; i <= month; i++){
          for (let j = current_day; j <= max_day; j++){
            this.datePickerObj_end.disabledDates.push(new Date(current_year, i -1 , j));
          } 
          current_day = 1;
          if (i+1 === month){
            max_day = day;
          } 
        }
      }
    } else {
       for (let i = current_year; i<= year; i++){
         for (let j=current_month; j<= max_month; j++){
           for (let k=current_day; k<=max_day; k++){
            this.datePickerObj_end.disabledDates.push(new Date(i, j -1 , k));
          } 
          current_day = 1;
          if (i === year && j+1===month){
            max_day = day;
          } 
        }  
        current_month = 1;
        if (i+1 === year){
          max_month = month;
        }
      } 
  
    }  



  } 

  addressLookup(address: string) {
    if (address.length > 3 && this.geo === true) {
      this.geoloc.addressLookup(address, 'dz', 4).subscribe(results => {
        this.searchResults = results;
      });
    } else {
      this.searchResults = [];
    }
  }

  updateSearch() {
   
    if (this.glb.searchQuery.address  == '') {
      this.searchResults  = [];
     return;
    }
    this.addressLookup(this.glb.searchQuery.address);
    if (this.searchResults != undefined && this.searchResults.length != 0){
      // console.log(this.searchResults[0]['display_name']);
    }
    if(this.geo === false){
        this.geo = true;
    }
  }

  async updateResult() {
    this.isLoading = true;

    //console.log('we are here');

    const searchRequest = {
      address : this.glb.searchQuery.address,
      lat: this.glb.searchQuery.lat,
      lon: this.glb.searchQuery.lon,
      startdate: this.glb.searchQuery.startdate.replace('-' , '/').replace('-' , '/'),
      enddate: this.glb.searchQuery.enddate.replace('-' , '/').replace('-' , '/') ,
      starttime: this.glb.searchQuery.starttime ,
      endtime: this.glb.searchQuery.endtime,
      filter: this.searchFilter,
      daysdif: this.glb.daysdif,
      offset: this.offset
    };
   // console.log(searchRequest);
    let id = this.glb.user.id;
    if (!this.loginServ.isLoggedIn()){
      id = '0';
    }
   // this.util.debug('id: ', id);
    const result = await this.db.fetchSearchreq(id, searchRequest);

    if (result['status'] === 'success') {
      this.glb.cars = result['data'];
      this.isLoading = false;
    } else {
      this.glb.cars = [];
      this.isLoading = false;
    }

  }


  chooseItem(item: any) {
    //console.log('chooseItem');
    this.glb.searchQuery.address = item['display_name'];
    this.glb.searchQuery.lat = item['lat'];
    this.glb.searchQuery.lon = item['lon'];
    this.geo = false;
    this.searchResults = [];
    this.updateResult();
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
