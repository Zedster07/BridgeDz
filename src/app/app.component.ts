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
  disabledDates: Date[] = [

  ];
  debutDateStr = this.todaysDate.getFullYear() + '/' + (this.todaysDate.getMonth() + 1) + '/' + (this.todaysDate.getDate())  ;
  finDateStr =  this.todaysDate.getFullYear() + '/' + (this.todaysDate.getMonth() + 1) + '/' + (this.todaysDate.getDate() + 1)  ;
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
    fromDate: this.myDate, // default null
    toDate: new Date('2021-12-28'), // default null
    showTodayButton: true, // default true
    closeOnSelect: true, // default false
    setLabel: 'Select',  // default 'Set'
    todayLabel: 'Aujourd\'hui', // default 'Today'
    closeLabel: 'Fermer', // default 'Close'
    disabledDates: this.disabledDates, // default []
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

  ) {
    this.initializeApp();
    if ( this.loginServ.isLoggedIn() ) {
      this.loginServ.reloadUserData();
    }
  }
  onScroll(event) {
    console.log(event);
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
    const debutTimestamp = new Date(this.glb.searchQuery.startdate.replace('-' , '/')).getTime();
    const finTimestamp = new Date(this.glb.searchQuery.enddate.replace('-' , '/')).getTime();
    if (debutTimestamp > finTimestamp) {
      console.log("error");
    } else {
      const ms = finTimestamp - debutTimestamp;
      let daysdif = ms / 1000;
      daysdif = daysdif / 60;
      daysdif = daysdif / 60;
      daysdif = daysdif / 24;
      this.daysdif = daysdif;
      console.log(this.daysdif);
    }
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
