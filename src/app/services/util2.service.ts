import { Injectable } from '@angular/core';
import { GlobalsService } from './globals.service';
import { UtilService } from './util.service';
import { LoadingService } from './loading.service';
import {TranslateService, TranslatePipe, TranslateModule} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})

export class Util2Service {
  event_agency = {
    pickup: {
      color : {
      primary: '#6610f2',
      secondary: '#d9dadd',
      }, 
      msg : {
        title : 'EVENT.PICKUP_TITLE',
        msg : 'EVENT.PICKUP_MSG',
      }, 
      isDragable : false,
    },
    given : {
      color : {
      primary: '#e74a3b',
      secondary: '#d9dadd',
      }, 
      msg : {
        title : 'EVENT.GIVEN_TITLE',
        msg : 'EVENT.GIVEN_MSG',
      },
      isDragable : false,
    },
    insu_exp : {
      color : {
      primary: '#fd7e14',
      secondary: '#d9dadd',
       }, 
       msg : {
        title : 'EVENT.INSU_EXP_TITLE',
        msg : 'EVENT.INSU_EXP_MSG',
      },
      isDragable : false,
    },
    tech_exp : {
      color : {
      primary: '#36b9cc',
      secondary: '#d9dadd',
      }, 
      msg : {
        title : 'EVENT.CONT_EXP_TITLE',
        msg : 'EVENT.CONT_EXP_MSG',
      },
      isDragable : false,
    },
    agency_event : {
      color : {
      primary: '#5a5c69',
      secondary: '#d9dadd',
      }, 
      msg : {
        title : 'EVENT.AGEN_TITLE',
        msg : 'EVENT.AGEN_MSG',
      },
      isDragable : false,

    },
    custom_event : {
      color : {
      primary: '#20c9a6',
      secondary: '#d9dadd',
      }, 
      msg : {
        title : '',
        msg : '',
      },
      isDragable : true,
    },
   }



  constructor(
    private loading: LoadingService,
    private util: UtilService,
    private glb: GlobalsService,
    public translate: TranslateModule,
    private translator: TranslateService,
  ) { }


  eventPreparation(event_agency, events){
    for (let i = 0 ; i< this.glb.event_agency.length; i++){
      let msg ;
      let color ;
      let isDragable;
      switch (event_agency[i]['type']){
        case '0' :
          color = this.event_agency.given.color;
          isDragable = this.event_agency.given.isDragable;
          msg = this.event_agency.given.msg.title +
           event_agency[i]['car_name'] + ' ' +
           event_agency[i]['car_vin'] + ' '+ 
           'à ' + event_agency[i]['hour'] + ' '+
           this.event_agency.given.msg.msg;
          break;
        case '1' :
          color = this.event_agency.pickup.color;
          isDragable = this.event_agency.pickup.isDragable;
          msg = this.event_agency.pickup.msg.title +
          event_agency[i]['car_name'] + ' ' +
          event_agency[i]['car_vin'] + ' '+ 
          'à ' + event_agency[i]['hour'] + ' '+
          this.event_agency.pickup.msg.msg;
          break;
        case '2' :
          color = this.event_agency.insu_exp.color;
          isDragable = this.event_agency.insu_exp.isDragable;
          msg = this.event_agency.insu_exp.msg.title +
          event_agency[i]['car_name'] + ' ' +
          event_agency[i]['car_vin'] + ' '+ 
          this.event_agency.insu_exp.msg.msg;
          break;
        case '3' :
          color = this.event_agency.tech_exp.color;
          isDragable = this.event_agency.tech_exp.isDragable;
          msg = this.event_agency.tech_exp.msg.title +
          event_agency[i]['car_name'] + ' ' +
          event_agency[i]['car_vin'] + ' '+ 
          this.event_agency.tech_exp.msg.msg;
          break;
        case '4' :
          color = this.event_agency.agency_event.color;
          isDragable = this.event_agency.agency_event.isDragable;
          msg = this.event_agency.agency_event.msg.title +
          event_agency[i]['car_name'] + ' ' +
          event_agency[i]['car_vin'] + ' '+ 
          this.event_agency.agency_event.msg.msg;
          break;
        case '5' :
          color = this.event_agency.custom_event.color;
          isDragable = this.event_agency.custom_event.isDragable;
          msg = event_agency[i]['message'];;
          break;
      }  
      const Ev = {
        start: this.util.dateClandarFormat(event_agency[i]['date_event']),
        end:   this.util.dateClandarFormat(event_agency[i]['date_event']),
        title:  msg,
        color: color,
        allDay: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        draggable: isDragable,
      };
     events.push(Ev);
    }
  } 



  fillSummarizeInfo(cars, wallet, summariez_info){
    const today = new Date();
    const str = today.getFullYear().toString() +'/' + (today.getMonth()+1).toString() +'/' + (today.getDate()).toString();
    for(let i =0 ; i < cars.length ; i++){ 
      if ((cars[i]['busy']).includes(str) || (cars[i]['prebooked']).includes(str))  
      { 
          summariez_info.rented_car++;
      } else {
          summariez_info.free_car++;
      }
    }
    if (wallet.length !== 0){
      summariez_info.real_balance = wallet['realBalance'];
      summariez_info.theo_balance = wallet['theoBalance'];
    } 
    this.util.debug('util 2 summariez_info', summariez_info);
    this.util.debug('util 2 cars', cars);
    this.util.debug('util 2 wallet', wallet);
  }


  maxStatus (booking_state){
    let max = booking_state.done;
    if (max < booking_state.cancled){
      max = booking_state.cancled;
    } 
    if (max < booking_state.waiting_for_validation){
      max = booking_state.waiting_for_validation;
    }  
    if (max < booking_state.verified){
      max = booking_state.verified;
    } 
    if (max < booking_state.on_going){
      max = booking_state.on_going;
    }  
    return max;
  } 


  buildBookingInState(bookings, booking_state, booking_state_c){
    for (let i= 0; i< bookings.length ; i++){
      switch (bookings[i]['status']){
        case '0':
          booking_state.done++;
        break;
        case '1':
          booking_state.cancled++;
        break;
        case '2':
          booking_state.waiting_for_validation++;
        break;
        case '3':
          booking_state.verified++;
        break;
        case '4':
          booking_state.on_going++;
        break;
      }   
    } 
    
    let max = this.maxStatus(booking_state);  
    booking_state_c.done = ((booking_state.done / max) * 100).toString() +'%';
    booking_state_c.cancled = ((booking_state.cancled / max) * 100).toString() +'%';
    booking_state_c.waiting_for_validation = ((booking_state.waiting_for_validation / max) * 100).toString() +'%';
    booking_state_c.verified = ((booking_state.verified / max) * 100).toString() +'%';
    booking_state_c.on_going = ((booking_state.on_going / max) * 100).toString() +'%';
  } 

  /*sortNbrRenting(car_perf_display, car_perf, display_all){
    car_perf_display=[];
    this.util.debug('util2 1 sortNbrRenting', car_perf_display );
    car_perf.sort((a, b)=> b.nbr_renting - a.nbr_renting);
    let index =car_perf.length > 6 ? 6 : car_perf.length;
    if(display_all === 0){
      for (let i =0; i<index; i++){
        car_perf_display.push(car_perf[i]);
      }
    } else {
      car_perf_display = car_perf;
    } 
  } 

  sortSum(car_perf_display, car_perf, display_all){
    car_perf_display=[];
    car_perf.sort((a, b)=> b.sum - a.sum);
    let index =car_perf.length > 6 ? 6 : car_perf.length;
    if(display_all === 0){
       for (let i =0; i<index; i++){
      car_perf_display.push(car_perf[i]);
    } 
  } else {
    car_perf_display = car_perf;
  } 
}*/


  buildPerfCars(cars, bookings, car_perf, booking_state, booking_state_c){
    for(let i =0 ; i < cars.length ; i++){ 
       let nbr_renting  = 0;
       let sum = 0;
       for (let j=0; j< bookings.length ; j++){
        if (cars[i]['id'] === bookings[j]['vehicleID']){
          nbr_renting = nbr_renting + 1;
          sum = sum + parseFloat(bookings[j]['totalPrice']);
         }  
       }
       const tmp = {
        index :i,
        model : cars[i]['model'],
        matricule :cars[i]['brand'],
        nbr_renting :nbr_renting,
        sum: sum,
       } 
    car_perf.push(tmp);
    } 
    //this.sortNbrRenting(car_perf_display, car_perf, display_all);
    this.buildBookingInState(bookings, booking_state, booking_state_c);
  } 

  

  prepareHistoricalRevenu(historical_wallet, barChartData){
    let xx = this.util.getYearString();
    for (let i =0; i < historical_wallet.length; i++){
      if (historical_wallet[i]['year'] === this.util.getYearString()){
          barChartData[historical_wallet[i]['type']]['data'][historical_wallet[i]['month']] = parseInt(historical_wallet[i]['value']);   
      } else {
        barChartData[historical_wallet[i]['type']]['data'][0] = parseInt(historical_wallet[i]['value']);
      } 
    }  
  }




}
