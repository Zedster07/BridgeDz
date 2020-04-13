import { Component, OnInit, ViewChild } from '@angular/core';
import {CalendarComponent} from 'ionic2-calendar/calendar';
import { NavParams, ModalController } from '@ionic/angular';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
@Component({
  selector: 'app-car-availability',
  templateUrl: './car-availability.page.html',
  styleUrls: ['./car-availability.page.scss'],
})
export class CarAvailabilityPage implements OnInit {
 /* date: string;
  type: 'string';
  carIndex = 0;
  timeSelected = new Date();
  eventSource = [];
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  carData = {};
  title = '';
  @ViewChild(CalendarComponent , {static: false}) myCal;*/

  constructor(public navParams: NavParams , private db: DbinteractionsService , private modalCtrl: ModalController) {

  }
 

  /*onChange($event) {
    console.log($event);
  }

  addEvent(selectedDate) {

  }

  swipeNext() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }

  swipeBack() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }

  onCurrentDateChanged(eventt) {}

  reloadSource(startTime, endTime) {}

  onRangeChanged = (ev: { startTime: Date, endTime: Date }) => {};

  onEventSelected(event) {}

  onViewTitleChanged(event) { this.title = event; }

  checkifExists(selectedDate) {
    let datee = selectedDate;
    let test = this.eventSource.filter(item => item.monthn === (datee.getMonth() + 1) && item.dayn === datee.getDate());
    if(test.length !== 0) {
      return false;
    } else {
      return true;
    }
  }

  getEventClass(som: any) {

    if (som[0] !== undefined && som[0].title === 'Pre Booked') {
      return 'prebookedclass';
    }

  }

  

  removeBook() {
    console.log('date selected is : ' + this.timeSelected);
    const dateTime = this.timeSelected;
    let newArray = [];
    console.log('the month is ' +  (dateTime.getMonth() + 1)  + ' day is : ' + dateTime.getDate());
    this.eventSource.forEach(item => {

      if ( (item.startTime.getDate() - 1)  !== (dateTime.getDate()) || item.startTime.getMonth() !== dateTime.getMonth()) {
        newArray.push(item);
      }

    });
    console.log('the new array ', newArray);
    this.eventSource = newArray;
    this.myCal.loadEvents();
  }

  onTimeSelected(eventt) {
    this.timeSelected = eventt.selectedTime;
    console.log(this.timeSelected);
  }

  preBook() {
    if (this.checkifExists(this.timeSelected)) {
      console.log(this.timeSelected);
      let startD = new Date(this.timeSelected);
      startD = new Date(startD.getFullYear() + '/' + (startD.getMonth() + 1) + '/' + (startD.getDate() + 1));
      startD.setHours(0, 0, 0, 0);
      let event = {
        title: 'Occupée',
        startTime: startD,
        endTime: startD,
        allDay: true,
        monthn: (startD.getMonth() + 1),
        dayn: startD.getDate()
      };

      this.eventSource.push(event);
      this.myCal.loadEvents();
      console.log(this.eventSource);
    }
  }
  async saveChanges() {
    const res = await this.db.updateAvail(this.eventSource , this.carIndex);
    console.log(res);
    if (res['status'] === 'response') {
      console.log(res);
      this.close();
    }
  }

  close() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }*/
  async ngOnInit() {
   /* this.carData = this.navParams.get('data');
    this.carIndex = this.navParams.get('idx');
    const res = await this.db.reloadEvents(this.carIndex);
    const data = res['data'];
    const busyarray = data['busy'].split(',');
    busyarray.forEach(element => {
      let startD = new Date(element);
      startD = new Date(startD.getFullYear() + '/' + (startD.getMonth() + 1) + '/' + (startD.getDate() + 1));
      console.log(startD);
      startD.setHours(0, 0, 0, 0);
      this.eventSource.push({
        title: 'Occupée',
        startTime: startD,
        endTime: startD,
        allDay: true
      });
      console.log(this.eventSource);
    });
    this.myCal.loadEvents();
    //this.title = this.carData['brand'] + ' ' + this.carData['model'];*/
  }

}
