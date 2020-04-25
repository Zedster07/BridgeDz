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
    console.log(event);
  }
  LoginAct() {
    if (this.loginServ.isLoggedIn()) {
      console.log("app.component.ts");
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
    this.datePickerObj_end.disabledDates = [];
    this.datePickerObj_end.highlightedDates = [];
    this.disableDate( new Date(this.glb.searchQuery.startdate));
    this.glb.daysdif = 1;
    this.strart_date = new Date(this.glb.searchQuery.startdate);
    this.util.debug('myFunction this.glb.searchQuery.startdate)', this.glb.searchQuery.startdate);
    this.util.debug('myFunction strart_date', this.strart_date);
  }

  myFunction_end() {
    const debutTimestamp = this.strart_date.getTime();

    const finTimestamp_ = new Date(this.glb.searchQuery.enddate);
    this.util.debug('finTimestamp_ app.component', finTimestamp_);
    this.util.debug('debutTimestamp app.component', debutTimestamp);
    const finTimestamp = finTimestamp_.getTime();
    this.util.debug('finTimestamp app.component', finTimestamp);

    if (debutTimestamp > finTimestamp) {
      console.log("error");
    } else {
      const ms = finTimestamp - debutTimestamp;
      let daysdif = ms / 1000;
      daysdif = daysdif / 60;
      daysdif = daysdif / 60;
      daysdif = daysdif / 24;
      this.glb.daysdif = daysdif;
    }
    this.util.debug('this.glb.daysdif APPCOMP MYFUNCTION-END', this.glb.daysdif);
  } 

  disableDate(start_date){
    let current_year = this.util.getCurrentYearNumber();
    let current_month = this.util.getCurrentMonthNumber();
    let current_day = this.util.getCurrentDayNumber();

    let year = this.util.getYearNumber(start_date);
    let month = this.util.getMonthNumber(start_date);
    let day = this.util.getDayNumber(start_date);
    
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
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
