import { Component, ViewChild , OnInit, NgZone} from '@angular/core';
import { PopoverController, PickerController, ModalController } from '@ionic/angular';
import { MenuListComponent } from '../menu-list/menu-list.component';
import { AnimationBuilder, PickerOptions } from '@ionic/core';
import { GlobalsService } from '../services/globals.service';
import { GeolocService } from '../services/geoloc.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { SearchGoogleAddressPage } from '../modals/search-google-address/search-google-address.page';
import {latLng, MapOptions, tileLayer, Map, Marker, icon} from 'leaflet';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NominatimResponse} from '../../../node_modules/angular-osm';
import {map} from 'rxjs/operators';
import { UtilService } from '../services/util.service';






@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  autocompleteItems;
  autocomplete;

  latitude: number = 0;
  longitude: number = 0;
  geo = true;

  latitude_1: number =  2.269675;
  longitude_1: number = 48.917402;

  map: Map;
  mapOptions: MapOptions;



  @ViewChild('finDate' , {static: true} ) finDate;
  @ViewChild('debutDate' , {static: true} ) debutDate;

  todaysDate = new Date();
  strart_date = new Date();
  end_date = new Date();
  isPhone = false;
  mySlideOptionsPhone = {
    initialSlide: 0,
    slidesPerView: 1,
    loop: true,
    pager: true,
    paginationType: 'bullets'
  };
  mySlideOptions = {
    initialSlide: 0,
    slidesPerView: 3,
    loop: true,
    pager: true,
    paginationType: 'bullets'
  };

  myDate = this.todaysDate.getFullYear() + '-' + (this.todaysDate.getMonth() + 1)  + '-' + this.todaysDate.getDay();


  disabledDates_start: Date[] = [
  ];
  disabledDates_end : Date[] = [
  ];
  debutDateStr = this.myDate;
  finDateStr = this.todaysDate.getFullYear() + '-' + (this.todaysDate.getMonth() + 1)  + '-' + (this.todaysDate.getDay() + 1);

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

    BASE_NOMINATIM_URL: string = 'nominatim.openstreetmap.org';
    DEFAULT_VIEW_BOX: string = 'viewbox=-25.0000%2C70.0000%2C50.0000%2C40.0000';

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


    searchResults: any[];
  constructor(
    public popoverController: PopoverController ,
    private loginserv: LoginService,
    private pickerCtrl: PickerController,
    public glb: GlobalsService,
    public geoloc: GeolocService,
    private route: Router,
    private zone: NgZone,
    private modalCtrl: ModalController,
    private http: HttpClient,
    private util: UtilService,
    private loading: LoadingService ) {
      if (window.screen.width <= 360 ) {
        this.isPhone = true;
      } else {
        this.isPhone = false;
      }
      this.glb.globalLoading(true);
      this.autocompleteItems = [];
      this.searchResults =[];
      this.autocomplete = {
        query: ''
      };
    }
  customPickerOptions: PickerOptions = {
    columns: [
      { name: 'Moi' , options: []},
      { name: 'Jour' , options: []},
      { name: 'Année' , options: []},
      { name: 'Heur' , options: []},
      { name: 'Minutes' , options: []},
    ]
  } ;


  myFunction() {
    this.datePickerObj_end.disabledDates = [];
    this.datePickerObj_end.highlightedDates = [];
    this.disableDate( new Date(this.glb.searchQuery.startdate));
    this.strart_date = new Date(this.glb.searchQuery.startdate);
    this.glb.daysdif = 1;
    //this.glb.searchQuery.enddate = this.glb.searchQuery.startdate;
  }

  async showSearchModal() {
    let modal = await this.modalCtrl.create({component: SearchGoogleAddressPage});
    let me = this;
    modal.present();
  }

  myFunction_end() {
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
  } 

  LoginAct() {
    if (this.loginserv.isLoggedIn()) {
      this.route.navigate(['client']);
    } else {
      this.route.navigate(['login']);
    }
  }

  gotosearch() {
    this.glb.sync = false;
    this.route.navigate(['search']);
  }

  dissmisPopover() {
    this.glb.popover.dismiss();
  }

  async presentPopover(ev: any) {
    const pop = await this.popoverController.create({
      component: MenuListComponent,
      event: ev,
    });
    return await pop.present();
  }
  ionViewWillEnter() {
    if (window.screen.width <= 360 ) {
      this.isPhone = true;
    } else {
      this.isPhone = false;
    }
    this.glb.isMainPage = true;

  }

  onScroll(event) {
    if (event.detail.scrollTop > 100) {
      this.glb.isMainPage = false;
    } else {
      this.glb.isMainPage = true;
    }
  }
  ngOnInit() {
    if (window.screen.width <= 360 ) {
      this.isPhone = true;
    } else {
      this.isPhone = false;
    }
    this.glb.globalLoading(false);
  }



  addressLookup(address: string) {
    if (address.length > 3 && this.geo === true) {
      this.geoloc.addressLookup(address, "dz", 4).subscribe(results => {
          this.searchResults = results;
      });
    } else {
      this.searchResults = [];
    }
  }

  chooseItem(item: any) {
    this.glb.searchQuery.address = item['display_name'];
    this.glb.searchQuery.lat = item['lat'];
    this.glb.searchQuery.lon = item['lon'];
    this.searchResults = [];
    this.geo = false;
    //console.log(item);
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


  updateSearch() {
    
    if (this.glb.searchQuery.address  == '') {
      this.searchResults  = [];
     return;
    }
    this.addressLookup(this.glb.searchQuery.address);
    if (this.searchResults != undefined && this.searchResults.length != 0){
       //console.log(this.searchResults[0]['display_name']);
    }
    if (this.geo === false){
      this.geo = true;
    }
    
  }

  // convert Address string to lat and long
  
 /*setCenter() {
    var view = this.map.getView();
    view.setCenter(ol.proj.fromLonLat([this.longitude_1, this.latitude_1]));
    view.setZoom(8);
  }*/

 /*onMapReady(map: Map) {
  this.map = map;
  this.addSampleMarker();
}

private initializeMapOptions() {
  this.mapOptions = {
    center: latLng(51.505, 0),
    zoom: 12,
    layers: [
      tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          attribution: 'Map data © OpenStreetMap contributors'
        })
    ],
  };
}

private addSampleMarker() {
  const marker = new Marker([51.51, 0])
    .setIcon(
      icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/marker-icon.png'
      }));
  marker.addTo(this.map);
}*/


}
