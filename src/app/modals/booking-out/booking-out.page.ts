import { Component, OnInit , ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { NavParams , ModalController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';
import { HttpEventType , HttpRequest , HttpClient, HttpEvent} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { GlobalsService } from 'src/app/services/globals.service';
import { UtilService } from 'src/app/services/util.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';

@Component({
  selector: 'app-booking-out',
  templateUrl: './booking-out.page.html',
  styleUrls: ['./booking-out.page.scss'],
})
export class BookingOutPage implements OnInit {

  @ViewChild('bookingOut' , {static: true}) bookingOut?: IonSlides;

  idAgency;
  type;
  steps;
  disabledDates_start;

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

  constructor(
    public modalCtrl: ModalController,
    private glb: GlobalsService,
    private loading: LoadingService,
    private db: DbinteractionsService,
    private http: HttpClient,
    private util :UtilService,
    public  navParams:NavParams
  ) { }

  ngOnInit() {
    this.idAgency = this.navParams.get('id');
    this.type = parseInt(this.navParams.get('actionType'));
  }

  public closeModal() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  myFunction(){
   }  
  async finalize() {
      this.closeModal();
  }

  slideNext(slideView){
  }
  
  slidePrev(slideView){
  }
}
