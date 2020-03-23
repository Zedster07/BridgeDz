import { Component, ViewChild , OnInit} from '@angular/core';
import { PopoverController, PickerController } from '@ionic/angular';
import { MenuListComponent } from '../menu-list/menu-list.component';
import { AnimationBuilder, PickerOptions } from '@ionic/core';
import { GlobalsService } from '../services/globals.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  @ViewChild('finDate' , {static: true} ) finDate;
  @ViewChild('debutDate' , {static: true} ) debutDate;
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
  todaysDate = new Date();
  myDate = this.todaysDate.getFullYear() + '-' + (this.todaysDate.getMonth() + 1)  + '-' + this.todaysDate.getDay();
  disabledDates: Date[] = [

  ];
  debutDateStr = this.myDate;
  finDateStr = this.todaysDate.getFullYear() + '-' + (this.todaysDate.getMonth() + 1)  + '-' + (this.todaysDate.getDay() + 1);
  datePickerObj: any = {
    fromDate: this.myDate, // default null
    toDate: new Date('2020-12-28'), // default null
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
    momentLocale: 'pt-BR', // Default 'en-US'
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
    public popoverController: PopoverController ,
    private loginserv: LoginService,
    private pickerCtrl: PickerController,
    public glb: GlobalsService,
    private route: Router,
    private loading: LoadingService ) {
      if (window.screen.width <= 360 ) {
        this.isPhone = true;
      } else {
        this.isPhone = false;
      }
      this.glb.globalLoading(true);
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
    console.log('something');
  }

  LoginAct() {
    if (this.loginserv.isLoggedIn()) {
      console.log("home.page.ts");
      this.route.navigate(['client']);
    } else {
      this.route.navigate(['login']);
    }
  }

  gotosearch() {
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
    console.log(window.screen.width);
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
    console.log(event);
  }
  ngOnInit() {
    if (window.screen.width <= 360 ) {
      this.isPhone = true;
    } else {
      this.isPhone = false;
    }
    this.glb.globalLoading(false);
  }
}
