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
}
