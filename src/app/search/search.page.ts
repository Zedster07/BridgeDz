import { Component, OnInit , ViewChild } from '@angular/core';
import { PopoverController, PickerController, ModalController } from '@ionic/angular';
import { AnimationBuilder, PickerOptions } from '@ionic/core';
import { DbinteractionsService } from '../services/dbinteractions.service';
import { ReservePage } from 'src/app/modals/reserve/reserve.page';
import { GlobalsService } from '../services/globals.service';
import { LoginService } from '../services/login.service';
import { UtilService } from '../services/util.service';
import { AgencyModalPage } from '../modals/agency-modal/agency-modal.page';
import { ClientMenuListComponent } from '../client/client-menu-list/client-menu-list.component';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  rangeSettings = {
    lower: 250,
    upper: 750
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
  // (please assign time with proper format which is describe below)
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
  constructor(
    private db: DbinteractionsService ,
    public glb: GlobalsService ,
    public modalController: ModalController,
    public popoverController: PopoverController,
    public loginSer: LoginService,
    public util: UtilService) { 
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
  async updateSearch() {
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
    if (!this.loginSer.isLoggedIn()){
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



  async reserveCar(index) {
  let id = this.glb.user.id;
  if (!this.loginSer.isLoggedIn()){
    id = '0';
  }
  const resp = await this.db.addHistoCar(this.glb.cars[index]['id'], 
                                          index,
                                          this.glb.searchQuery.startdate.replace('-' , '/').replace('-' , '/'),
                                          this.glb.searchQuery.enddate.replace('-' , '/').replace('-' , '/') , 
                                          this.glb.searchQuery.starttime,
                                          this.glb.searchQuery.endtime,
                                          this.searchFilter,
                                          this.glb.daysdif,
                                          this.glb.searchQuery.address);
   
    this.util.debug('this.glb.daysdif RESERVE CAR SEARCH', this.glb.daysdif);
    let CarData = this.glb.cars[index];
    const modal = await this.modalController.create({
      component: ReservePage,
      // backdropDismiss: false,
      componentProps: {
        type: '',
        days: this.glb.daysdif,
        data: CarData
      }
    });
    return await modal.present();
  }

  myFunction() {
    const debutTimestamp = new Date(this.glb.searchQuery.startdate.replace('-' , '/')).getTime();
    const finTimestamp = new Date(this.glb.searchQuery.enddate.replace('-' , '/')).getTime();
   // console.log(this.glb.searchQuery.startdate + ' , ' + this.glb.searchQuery.enddate);
   // this.util.debug('this.glb.daysdif SEARCH', this.glb.daysdif);
   // console.log(this.glb.daysdif);
    if (debutTimestamp > finTimestamp) {
      console.log("error");
    } else {
     
      const ms = finTimestamp - debutTimestamp;
      let daysdif = ms / 1000;
      daysdif = daysdif / 60;
      daysdif = daysdif / 60;
      daysdif = daysdif / 24;
      this.daysdif = daysdif;
      //console.log(this.daysdif);
      this.updateSearch();
    }

   // console.log(this.glb.daysdif);
  }
  getFrontPic(piclist) {
    return this.glb.hostServer + piclist;
  }
  ngOnInit() {
    this.updateSearch();
  }
  ionViewWillLeave() {
    this.glb.isSearchPage = false;
  }
  async ionViewWillEnter() {
    this.glb.isSearchPage = true;
    this.glb.isMainPage = false;
    if (this.glb.prevAction === 'book') {
      this.glb.prevAction = '';
      const modal = await this.modalController.create({
        component: ReservePage,
        // backdropDismiss: false,
        componentProps: {
          type: '',
          days: this.glb.prevBook['days'],
          data: this.glb.prevBook['car'],
        }
      });
      await modal.present();
    }
  }

}
