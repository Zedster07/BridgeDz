import { Component, OnInit, ElementRef } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { ModalController } from '@ionic/angular';
import { StartLocAgencyPage } from 'src/app/modals/start-loc-agency/start-loc-agency.page';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  tabVal = 'general';
  moseov = false;
  iconName = 'radio-button-off';
  notifications = [
    {
      id: 1,
      title: 'Notification Title 1 ',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud',
      read: true,
      icon: 'radio-button-off'
    },
    {
      id: 2,
      title: 'Notification Title 2 ',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud',
      read: false,
      icon: 'checkmark-circle'
    }
    ,{
      id: 3,
      title: 'Notification Title 3 ',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud',
      read: false,
      icon: 'checkmark-circle'
    },
    {
      id: 4,
      title: 'Notification Title 4 ',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud',
      read: true,
      icon: 'radio-button-off'
    }
  ];
   
  constructor(
    private db: DbinteractionsService, 
    public glb: GlobalsService, 
    private modalController: ModalController) {}
  setRead(val: number) {
    this.glb.AgencyLogData.notificationsCount -= 1;
    this.notifications[val - 1].icon = 'checkmark-circle';
    this.notifications[val - 1].read = false;
    const elem = document.getElementById('item-' + val);
    const nicon = elem.firstElementChild;
    nicon.setAttribute('name' , 'checkmark-circle');
   // elem.className += ' item-read';
    
  }

  setTabVal( val: string) {
    this.tabVal = val;
  }

  showTab(val: string): boolean {
    if (val === this.tabVal) {
      return true;
    }
    return false;
  }
  async startProcess(target) {
    const modal = await this.modalController.create({
      component: StartLocAgencyPage,
      backdropDismiss: false,
      componentProps: {
        data: target
      }
    });
    return await modal.present();
  }
  async ionViewWillEnter() {
    const res = await this.db.fetchDashNotifications(this.glb.AgencyLogData.id);
  }
  async ngOnInit() {}

}
