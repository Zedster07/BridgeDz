import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import {ChangeDetectionStrategy,ViewEncapsulation, } from '@angular/core';
import {TranslateService, TranslatePipe, TranslateModule} from '@ngx-translate/core';
import { WeekViewHour } from 'calendar-utils';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { UtilService } from 'src/app/services/util.service';
import { Util2Service } from 'src/app/services/util2.service';
import {startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth,addHours} from 'date-fns';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color, SingleDataSet, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { Subject } from 'rxjs';
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarView} from 'angular-calendar';

import { booking_status } from '../../interfaces/booking_status';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HomePage implements OnInit {

  view: CalendarView = CalendarView.Month;
  carData :any;
  carIndex : any;
  viewDate: Date = new Date();
  selectedMonthViewDay: CalendarMonthViewDay;
  selectedDayViewDate: Date;
  dayView: WeekViewHour[];
  refresh: Subject<any> = new Subject();
  msg_display : string;


  barChartOptions: ChartOptions = {
    responsive: true,
    
  };
  pieChartOptions: ChartOptions = {
    responsive: true,
  };
  gaugeType = "arch";
  gaugeValue = 28.3;
  gaugeAppendText = "‎€";
  foregroundColor="#4e73df";
  backgroundColor='#5a5c69';
  size = 15;
  type= "full";
  cap="round";
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], backgroundColor: '#4e73df', hoverBackgroundColor: '#6610f2', label: 'WALLET.INSIDE_BRIDGY' },
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], backgroundColor: '#858796', hoverBackgroundColor: '#5a5c69',  label: 'WALLET.OUTSIDE_BRIDGY' }
  ];
  pieChartData: SingleDataSet = [30, 500];
  pieColor: Color[] =  [{backgroundColor: '#4e73df', hoverBackgroundColor: '#6610f2' },
                        {backgroundColor: '#858796', hoverBackgroundColor: '#5a5c69' }];
  
  bpiChartData: ChartDataSets[] = [
    { data: [30, 50], backgroundColor: ['#4e73df', '#858796'], hoverBackgroundColor: ['#6610f2', '#5a5c69'] }];     

  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [];

  car_perf = [];
  car_perf_display = [];
  car = [];
  booking = [];
  wallet = [];
  historical_wallet = [];
   
  index_perf  = 0;
  display_all = 0;
  
  summariez_info = {
    rented_car : 0,
    free_car : 0,
    real_balance : 0,
    theo_balance : 0,
  }

   /*colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3',
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF',
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    },
  };*/

  modalData: {
    action: string;
    event: CalendarEvent;
  };
  activeDayIsOpen: boolean = true;
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.glb.events = this.glb.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];




  constructor(
    public translate: TranslateModule,
    private translator: TranslateService,
    private loading: LoadingService,
    private db: DbinteractionsService,
    public glb: GlobalsService,
    public util: UtilService,
    public util2: Util2Service,



  ) { 
    monkeyPatchChartJsLegend();
    monkeyPatchChartJsTooltip();

  }

  


  async ionViewWillEnter() {  
    //this.initialize();
                      
    // retreive dashboard home data
    this.loading.presentLoading();
    let agncy_id = this.glb.AgencyLogData.id;
    if(this.glb.ifAdmin(this.glb.user.role)){
      agncy_id ='-1';
    }   

  if (this.glb.cars.length === 0 || this.glb.bookings.length === 0 || this.glb.ifAdmin(this.glb.user.role))
  {
    this.glb.resetDashBoard();
    this.car_perf_display = [];
    this.glb.cars = [];
    this.glb.bookings = [];
    this.glb.car_perf= [];
    //load car if not loaded.
    if(this.glb.cars.length === 0 || this.glb.ifAdmin(this.glb.user.role)){
      const res = await this.db.fetchCars(this.glb.AgencyLogData.id, this.glb.user.id);
      if(res.status === 'success'){
        this.glb.cars = res.data;
      }
    }
    // load booking if not laoded.
    if(this.glb.bookings.length === 0 || this.glb.ifAdmin(this.glb.user.role)){
      const res_booking = await this.db.fetchBooking('-1', agncy_id);
      if(res_booking.status === 'success'){
        this.glb.bookings = res_booking.data;
      }
    }

    this.util2.buildPerfCars(this.glb.cars, this.glb.bookings, this.glb.car_perf, this.glb.booking_state, this.glb.booking_state_c);
  }

    

    // load wallet if not laoded.
    if(this.glb.wallet.length === 0 || this.glb.ifAdmin(this.glb.user.role)){
      const res_wallet = await this.db.fetchWallet(agncy_id, this.glb.user.id);
      if (res_wallet.status === 'success') {
        this.glb.wallet = res_wallet.data;
        const res_historical_wallet = await this.db.fetchHistoricalWallet(agncy_id, this.glb.user.id, this.glb.wallet['id']);
        if (res_historical_wallet.status = 'success') {
          this.historical_wallet = res_historical_wallet.data;
          this.util2.prepareHistoricalRevenu(this.historical_wallet, this.glb.barChartData);
        }
      }
    }

    // load event if not laoded.
    if (this.glb.event_agency.length === 0 || this.glb.ifAdmin(this.glb.user.role)) {
        this.glb.events = [];
        const resp_event = await this.db.fetchEventAgency(agncy_id);
        if (resp_event['status'] === 'success'){
          this.glb.event_agency = resp_event['data'];
          this.util2.eventPreparation(this.glb.event_agency, this.glb.events);
      } 
    }


    
    this.sortNbrRenting();
    this.util2.fillSummarizeInfo(this.glb.cars, this.glb.wallet, this.glb.summariez_info);
    
   
    this.refresh.next(); 
    this.translator.get(['MONTH.YEAR_BEFOR',
                         'MONTH.JANUARY',
                         'MONTH.FEBRUARY',
                         'MONTH.MARCH',
                         'MONTH.APRIL',
                         'MONTH.MAI',
                         'MONTH.JUNE',
                         'MONTH.JULY',
                         'MONTH.AUGUST',
                         'MONTH.SEPTMBER',
                         'MONTH.OCOTOBER',
                         'MONTH.NOVOMBER',
                         'MONTH.DECEMBER',
                         'WALLET.OUTSIDE_BRIDGY',
                         'WALLET.INSIDE_BRIDGY',
                         'INDICATOR.NBR_RENTING',
                         'INDICATOR.PRICE_MEAN',
                         'EVENT.PICKUP_TITLE',
                         'EVENT.PICKUP_MSG',
                         'EVENT.GIVEN_TITLE',
                         'EVENT.GIVEN_MSG',
                         'EVENT.INSU_EXP_TITLE',
                         'EVENT.INSU_EXP_MSG',
                         'EVENT.CONT_EXP_TITLE',
                         'EVENT.CONT_EXP_MSG',
                         'EVENT.AGEN_TITLE',
                         'EVENT.AGEN_MSG',
                         ]).subscribe(val => {
                          this.glb.barChartLabels[0] = val['MONTH.YEAR_BEFOR'];
                          this.glb.barChartLabels[1] = val['MONTH.JANUARY'];
                          this.glb.barChartLabels[2] = val['MONTH.FEBRUARY'];
                          this.glb.barChartLabels[3] = val['MONTH.MARCH'];
                          this.glb.barChartLabels[4] = val['MONTH.APRIL'];
                          this.glb.barChartLabels[5] = val['MONTH.MAI'];
                          this.glb.barChartLabels[6] = val['MONTH.JUNE'];
                          this.glb.barChartLabels[7] = val['MONTH.JULY'];
                          this.glb.barChartLabels[8] = val['MONTH.AUGUST'];
                          this.glb.barChartLabels[9] = val['MONTH.SEPTMBER'];
                          this.glb.barChartLabels[10] = val['MONTH.OCOTOBER'];
                          this.glb.barChartLabels[11] = val['MONTH.NOVOMBER'];
                          this.glb.barChartLabels[12] = val['MONTH.DECEMBER'];
                          this.glb.barChartData[1]['label'] = val['WALLET.OUTSIDE_BRIDGY'];
                          this.glb.barChartData[0]['label'] = val['WALLET.INSIDE_BRIDGY'];
                          this.glb.pieChartLabels[0] = val['WALLET.INSIDE_BRIDGY'];
                          this.glb.pieChartLabels[1] = val['WALLET.OUTSIDE_BRIDGY'];
                          this.glb.gaugeLabel_rent = val['INDICATOR.NBR_RENTING'];
                          this.glb.gaugeLabel_price = val['INDICATOR.PRICE_MEAN'];
                          for (let i=0; i<this.glb.events.length; i++){
                            switch (this.glb.event_agency[i]['type']){
                              case '0':
                                this.glb.events[i]['title'] =
                                   val['EVENT.GIVEN_TITLE'] +
                                  this.glb.event_agency[i]['car_name'] + ' ' +
                                  this.glb.event_agency[i]['car_vin'] + ' '+ 
                                  this.glb.event_agency[i]['hour'] + ' '+
                                  val['EVENT.GIVEN_MSG'];
                                break;
                              case '1':
                                this.glb.events[i]['title'] =
                                  val['EVENT.PICKUP_TITLE'] +
                                  this.glb.event_agency[i]['car_name'] + ' ' +
                                  this.glb.event_agency[i]['car_vin'] + ' '+ 
                                  this.glb.event_agency[i]['hour'] + ' '+
                                  val['EVENT.PICKUP_MSG'];
                                break;
                              case '2':
                                this.glb.events[i]['title'] =
                                  val['EVENT.INSU_EXP_TITLE'] +
                                  this.glb.event_agency[i]['car_name'] + ' ' +
                                  this.glb.event_agency[i]['car_vin'] + ' '+ 
                                  this.glb.event_agency[i]['hour'] + ' '+
                                  val['EVENT.INSU_EXP_MSG'];
                                break;
                              case '3':
                                this.glb.events[i]['title'] =
                                  val['EVENT.CONT_EXP_TITLE'] +
                                  this.glb.event_agency[i]['car_name'] + ' ' +
                                  this.glb.event_agency[i]['car_vin'] + ' '+ 
                                  this.glb.event_agency[i]['hour'] + ' '+
                                  val['EVENT.CONT_EXP_MSG'];
                                break;
                              case '4':
                                this.glb.events[i]['title'] =
                                  val['EVENT.AGEN_TITLE'] +
                                  this.glb.event_agency[i]['car_name'] + ' ' +
                                  this.glb.event_agency[i]['car_vin'] + ' '+ 
                                  this.glb.event_agency[i]['hour'] + ' '+
                                  val['EVENT.AGEN_MSG'];
                                break;
                            }
                          }
                        } );

    this.loading.dismissLoading();
  }

  refreshView(): void {
    this.refresh.next();  
  }

  /*fillSummarizeInfo(){
    const today = new Date();
    const str = today.getFullYear().toString() +'/' + (today.getMonth()+1).toString() +'/' + (today.getDate()).toString();
    for(let i =0 ; i < this.glb.cars.length ; i++){ 
      if ((this.glb.cars[i]['busy']).includes(str) || (this.glb.cars[i]['prebooked']).includes(str))  
      { 
          this.glb.summariez_info.rented_car++;
      } else {
          this.glb.summariez_info.free_car++;
      }
    }
    if (this.glb.wallet.length !== 0){
      this.glb.summariez_info.real_balance = this.glb.wallet['realBalance'];
      this.glb.summariez_info.theo_balance = this.glb.wallet['theoBalance'];
    } 
  }*/

  /*buildPerfCars(){
    for(let i =0 ; i < this.glb.cars.length ; i++){ 
       let nbr_renting  = 0;
       let sum = 0;
       for (let j=0; j< this.glb.bookings.length ; j++){
        if (this.glb.cars[i]['id'] === this.glb.bookings[j]['vehicleID']){
          nbr_renting = nbr_renting + 1;
          sum = sum + parseFloat(this.glb.bookings[j]['totalPrice']);
         }  
       }
       const tmp = {
        index :i,
        model : this.glb.cars[i]['model'],
        matricule :this.glb.cars[i]['brand'],
        nbr_renting :nbr_renting,
        sum: sum,
       } 
    this.car_perf.push(tmp);
    } 
    this.sortNbrRenting();
    this.util2.buildBookingInState(this.glb.bookings, this.booking_state, this.booking_state_c);
  }*/

  /*buildBookingInState(){
    for (let i= 0; i< this.glb.bookings.length ; i++){
      switch (this.glb.bookings[i]['status']){
        case '0':
          this.booking_state.done++;
        break;
        case '1':
          this.booking_state.cancled++;
        break;
        case '2':
          this.booking_state.waiting_for_validation++;
        break;
        case '3':
          this.booking_state.verified++;
        break;
        case '4':
          this.booking_state.on_going++;
        break;
      }   
    } 
    
    let max = this.util2.maxStatus(this.booking_state);  
    this.booking_state_c.done = ((this.booking_state.done / max) * 100).toString() +'%';
    this.booking_state_c.cancled = ((this.booking_state.cancled / max) * 100).toString() +'%';
    this.booking_state_c.waiting_for_validation = ((this.booking_state.waiting_for_validation / max) * 100).toString() +'%';
    this.booking_state_c.verified = ((this.booking_state.verified / max) * 100).toString() +'%';
    this.booking_state_c.on_going = ((this.booking_state.on_going / max) * 100).toString() +'%';
  }  */
  buildBookingOutState(){
  } 


  /*prepareHistoricalRevenu(){
    
    let xx = this.util.getYearString();
    for (let i =0; i < this.historical_wallet.length; i++){
      if (this.historical_wallet[i]['year'] === this.util.getYearString()){
          this.glb.barChartData[this.historical_wallet[i]['type']]['data'][this.historical_wallet[i]['month']] = parseInt(this.historical_wallet[i]['value']);   
      } else {
        this.glb.barChartData[this.historical_wallet[i]['type']]['data'][0] = parseInt(this.historical_wallet[i]['value']);
      } 
    }  
  } */ 
  
  /*maxStatus (){
    let max = this.booking_state.done;
    if (max < this.booking_state.cancled){
      max = this.booking_state.cancled;
    } 
    if (max < this.booking_state.waiting_for_validation){
      max = this.booking_state.waiting_for_validation;
    }  
    if (max < this.booking_state.verified){
      max = this.booking_state.verified;
    } 
    if (max < this.booking_state.on_going){
      max = this.booking_state.on_going;
    }  
    return max;
  }*/

  /**/

  sortSum(){
    this.car_perf_display=[];
    this.car_perf.sort((a, b)=> b.sum - a.sum);
    let index =this.glb.car_perf.length > 6 ? 6 : this.glb.car_perf.length;
    if(this.display_all === 0){
       for (let i =0; i<index; i++){
      this.car_perf_display.push(this.glb.car_perf[i]);
    } 
  } else {
    this.car_perf_display = this.glb.car_perf;
  } 
}

sortNbrRenting(){
  this.car_perf_display=[];
  this.util.debug('util2 1 sortNbrRenting', this.car_perf_display );
  this.glb.car_perf.sort((a, b)=> b.nbr_renting - a.nbr_renting);
  let index =this.glb.car_perf.length > 6 ? 6 : this.glb.car_perf.length;
  if(this.display_all === 0){
    for (let i =0; i<index; i++){
      this.car_perf_display.push(this.glb.car_perf[i]);
    }
  } else {
    this.car_perf_display = this.glb.car_perf;
  } 
} 

  displayAll(){
    if(this.display_all === 0){
        this.display_all = 1;
        this.sortNbrRenting();
        this.util.debug('displayALL', this.glb.car_perf_display);
    } else {
      this.display_all = 0;
      this.sortNbrRenting();
    } 
  } 
  ngOnInit() {
    this.refresh.next();
    this.util.debug('ngOnInit', 'home');
  }

  initialize(){
    for (let i=0; i<this.barChartData[0]['data'].length ; i++){
      this.barChartData[0]['data'][i] = 0;
    }  
    for (let i=0; i<this.bpiChartData[0]['data'].length; i++) {
      //this.bpiChartData[0]['data'][i] = 0;
    } 
    this.glb.summariez_info.free_car =0;
    this.glb.summariez_info.real_balance = 0;
    this.glb.summariez_info.rented_car = 0;
    this.glb.summariez_info.theo_balance = 0;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.util.debug('day clicked', subDays(endOfMonth(new Date()), 3));
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }


  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.glb.events = this.glb.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    //this.modal.open(this.modalContent, { size: 'lg' });
  }


  ionViewWillLeave(){
    this.initialize();
  } 
}
