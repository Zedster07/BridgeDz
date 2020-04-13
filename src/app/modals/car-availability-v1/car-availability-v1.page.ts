import { Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import {ChangeDetectionStrategy,ViewEncapsulation, } from '@angular/core';
import {CalendarEvent, CalendarMonthViewDay, CalendarView} from 'angular-calendar';
import { WeekViewHour } from 'calendar-utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { booking_status } from '../../interfaces/booking_status';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { UtilService } from 'src/app/services/util.service';
import { NavParams, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-car-availability-v1',
  templateUrl: './car-availability-v1.page.html',
  styleUrls: ['./car-availability-v1.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})


export class CarAvailabilityV1Page implements OnInit {

  view: CalendarView = CalendarView.Month;
  carData :any;
  carIndex : any;
  viewDate: Date = new Date();
  selectedMonthViewDay: CalendarMonthViewDay;
  selectedDayViewDate: Date;
  dayView: WeekViewHour[];
  events: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();
  msg_display : string;

  constructor(private cdr: ChangeDetectorRef,
             private db:DbinteractionsService,
             public glb:GlobalsService,
             public navParams: NavParams,
             private util :UtilService) {}


  async ngOnInit() {
    this.carData = this.navParams.get('data');
    this.carIndex = this.navParams.get('idx'); 
    await this.prepareData();
    this.refresh.next();
  }

  async ionViewWillEnter(){   
    console.log('ionViewWillEnter');
  }

  dayClicked(day: CalendarMonthViewDay): void {
    console.log(this.glb.selectedDays);
    let date = new Date();
    this.selectedMonthViewDay = day;
    const selectedDateTime = this.selectedMonthViewDay.date.getTime();
    const dateIndex = this.glb.selectedDays.findIndex(
      (selectedDay) => selectedDay.date.getTime() === selectedDateTime
    ); 
    if ((selectedDateTime < date.getTime())){
      //this.msg_display = 'Vous ne pouvez pas changé une date anterieure';
      return;
    }
    if ((dateIndex > -1)){
      for (let i=0; i< this.glb.selectedDays.length; i++){
        if ((this.glb.selectedDays[i].cssClass !== 'cal-day-busy_future' && this.glb.selectedDays[i].date.getTime() === selectedDateTime)){
          //this.msg_display = 'date déja réservée';
          return;
        }  
      }
      delete this.selectedMonthViewDay.cssClass;
      this.glb.selectedDays.splice(dateIndex, 1);
      //this.msg_display = 'Vous venez de libérer cette date';
    } else {
      this.glb.selectedDays.push(this.selectedMonthViewDay);
      day.cssClass = 'cal-day-busy_future';
      this.selectedMonthViewDay = day;
      //this.msg_display = 'Date bloquée';
    }
    
  }

  async saveChanges(){
    
    let dateBusy : string ='';
    let dateBookedInside : string ='';
    let dateBookedOutside : string='';
    let datePreBooked : string='';

    for (let i=0; i<this.glb.selectedDays.length; i++){   
        let year = this.glb.selectedDays[i].date.getFullYear();
        let month = (this.glb.selectedDays[i].date.getMonth() + 1);
        let day = this.glb.selectedDays[i].date.getDate();
        switch (this.glb.selectedDays[i].cssClass){
          case 'cal-day-busy_past':
            dateBusy = dateBusy + ',' + year.toString() + '/' + month.toString() + '/' + day.toString();
            break;
          case 'cal-day-busy_future':
            dateBusy = dateBusy + ',' + year.toString() + '/' + month.toString() + '/' + day.toString();
            break;
          case 'cal-day-pre_booked_past':
            datePreBooked = datePreBooked + ',' + year.toString() + '/' + month.toString() + '/' + day.toString();
            break;
          case 'cal-day-pre_booked_future':
            datePreBooked = datePreBooked + ',' + year.toString() + '/' + month.toString() + '/' + day.toString();
            break;
          case 'cal-day-booked_inside_past':
            dateBookedInside = dateBookedInside + ',' + year.toString() + '/' + month.toString() + '/' + day.toString();
            break;
          case 'cal-day-booked_inside_future':
            dateBookedInside = dateBookedInside + ',' + year.toString() + '/' + month.toString() + '/' + day.toString();
            break;
          case 'cal-day-booked_outside_past':
            dateBookedOutside = dateBookedOutside + ',' + year.toString() + '/' + month.toString() + '/' + day.toString();
            break;
          case 'cal-day-booked_outside_future':
            dateBookedOutside = dateBookedOutside + ',' + year.toString() + '/' + month.toString() + '/' + day.toString();
            break;
        }
        
     }  
    const res = await this.db.updateAvail_v1(dateBusy, dateBookedInside, dateBookedOutside, datePreBooked, this.carIndex);
    if (res['status'] === 'response') {
    }
  } 

  

  async beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): Promise<any>  { 
    if(this.glb.selectedDays.length !== 0) {
      for (let i= 0; body.length; i++){
        for (let  j= 0; j<this.glb.selectedDays.length; j++){
          if ((this.util.checkValid(body[i].date)) && (body[i].date.getTime() === this.glb.selectedDays[j].date.getTime())){  
              body[i].cssClass = this.glb.selectedDays[j].cssClass;
          }
        }
      }
    }
  }

  refreshView(): void {
    this.refresh.next();  
  }


  hourSegmentClicked(date: Date) {
    this.selectedDayViewDate = date;
    this.addSelectedDayViewClass();
    console.log(this.selectedDayViewDate);
  }

  beforeDayViewRender(dayView: WeekViewHour[]) {
    this.dayView = dayView;
    this.addSelectedDayViewClass();
  }

  private addSelectedDayViewClass() {
    this.dayView.forEach((hourSegment) => {
      hourSegment.segments.forEach((segment) => {
        delete segment.cssClass;
        if (
          this.selectedDayViewDate &&
          segment.date.getTime() === this.selectedDayViewDate.getTime()
        ) {
          segment.cssClass = 'cal-day-selected';
        }
      });
    });
  }


  async prepareData(){
    console.log(this.carIndex);
    const res = await this.db.fetchAvail_v1(this.carIndex);
    if(res['status'] === 'success'){
      const data = res['data'];
      const busyarray = data['busy'].split(',');
      for (let i=0; i<busyarray.length;i++){
            let cssClass ='cal-day-busy_future';
            let isPast = false;
            let isFuture = true;
            let startD = new Date(busyarray[i]);
            startD = new Date(startD.getFullYear() + '/' + (startD.getMonth() + 1) + '/' + (startD.getDate()));
            startD.setHours(0,0,0,0);
            console.log(startD);
            if(startD.getTime() < new Date().getTime()){
              cssClass = 'cal-day-busy_past';
              isPast = true;
              isFuture = false;
            } 
            const emittedValue = {
              day: {
                badgeTotal: 0,
                cssClass: cssClass,
                date: startD,
                events: [],
                inMonth: true,
                isFuture: isFuture,
                isPast: isPast,
                isToday: true,
                isWeekend: false,
              }
            };
          this.glb.selectedDays.push(emittedValue.day);
      }
      const preBookedarray = data['pre_booked'].split(',');
      for (let i=0; i<preBookedarray.length;i++){
          let cssClass ='cal-day-pre_booked_future';
          let isPast = false;
          let isFuture = true;
          let startD = new Date(preBookedarray[i]);
          startD = new Date(startD.getFullYear() + '/' + (startD.getMonth() + 1) + '/' + (startD.getDate()));
          startD.setHours(0,0,0,0);
          if(startD.getTime() < new Date().getTime()){
            cssClass = 'cal-day-pre_booked_past';
            isPast = true;
            isFuture = false;
          } 
          const emittedValue = {
            day: {
              badgeTotal: 0,
              cssClass:cssClass,
              date: startD,
              events: [],
              inMonth: true,
              isFuture: isFuture,
              isPast: isPast,
              isToday: true,
              isWeekend: false,
            }
          };
        this.glb.selectedDays.push(emittedValue.day);
      }
      const BookedInarray = data['booked_inside'].split(',');
      for (let i=0; i<BookedInarray.length;i++){
        let cssClass ='cal-day-booked_inside_future';
          let isPast = false;
          let isFuture = true;
        let startD = new Date(BookedInarray[i]);
          startD = new Date(startD.getFullYear() + '/' + (startD.getMonth() + 1) + '/' + (startD.getDate()));
          startD.setHours(0,0,0,0);
          if(startD.getTime() < new Date().getTime()){
            cssClass = 'cal-day-booked_inside_past';
            isPast = true;
            isFuture = false;
          } 
          const emittedValue = {
            day: {
              badgeTotal: 0,
              cssClass:cssClass,
              date: startD,
              events: [],
              inMonth: true,
              isFuture: false,
              isPast: isPast,
              isToday: isFuture,
              isWeekend: false,
            }
          };
        this.glb.selectedDays.push(emittedValue.day);
      }
      const BookedOutarray = data['booked_outside'].split(',');
      for (let i=0; i<BookedOutarray.length;i++){
          let cssClass ='cal-day-booked_outside_future';
          let isPast = false;
          let isFuture = true;
          let startD = new Date(BookedOutarray[i]);
          startD = new Date(startD.getFullYear() + '/' + (startD.getMonth() + 1) + '/' + (startD.getDate()));
          startD.setHours(0,0,0,0);
          if(startD.getTime() < new Date().getTime()){
            cssClass = 'cal-day-booked_outside_past';
            isPast = true;
            isFuture = false;
          }
          const emittedValue = {
            day: {
              badgeTotal: 0,
              cssClass: cssClass,
              date: startD,
              events: [],
              inMonth: true,
              isFuture: isFuture,
              isPast: isPast,
              isToday: true,
              isWeekend: false,
            }
          };
        this.glb.selectedDays.push(emittedValue.day);
      }
      console.log(this.glb.selectedDays);
      return this.glb.selectedDays;
    }
  }

 delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
}


