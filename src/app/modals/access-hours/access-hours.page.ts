import { Component, OnInit } from '@angular/core';
import { NgCalendarModule } from 'ionic2-calendar';
import { element } from 'protractor';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-access-hours',
  templateUrl: './access-hours.page.html',
  styleUrls: ['./access-hours.page.scss'],
})
export class AccessHoursPage implements OnInit {

  date: string;
  type: 'string';
  alldays = 'all';
  data = {
    alldays: 'all',
    startdate: 'samedi',
    enddate  : 'vendredi',
    starttime: '12:00',
    endtime  : '12:00'
  };
  constructor(private db: DbinteractionsService, public modalCtrl: ModalController) { }

  async saveChanges() {
    console.log('Updating Access Hours');
    const res = await this.db.updateAccessH(this.data);
    if (res.message === 'Success') {
      this.closeModal();
    }
  }

  public closeModal() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  toggleDays(val) {
    const element1 =  (document.getElementById('daysa') as HTMLInputElement);
    const element2 =  (document.getElementById('daysde') as HTMLInputElement);
    if (val === 'all') {
      element1.disabled = true;
      element2.disabled = true;
    } else {
      element2.disabled = false;
      element1.disabled = false;
    }
  }
  onChange($event) {
    console.log($event);
  }

  onCurrentDateChanged(event) {
    console.log('event curr date cnahged' , event);
  }
  
  reloadSource(startTime, endTime) {}
  onEventSelected(event) { console.log('event selected', event); }
  onViewTitleChanged(event) { console.log( 'event title changed', event); }
  onTimeSelected(event) { console.log(event); }
  ngOnInit() {}

}
