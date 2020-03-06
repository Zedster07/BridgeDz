import { Component, OnInit, ElementRef } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  tabVal = 'general';
  moseov = false;
  iconName = 'radio-button-off';
  demandeLoc = [
    {
      id: 1,
      title: 'Demand 1',
      start: '12/03/2019 à 10h',
      end: '15/03/2019 à 10h',
      duree: '3 jours',
      prix: '120 euros',
      rdv: '10h à Aéroport de XXXX',
      apermis: 'XX années',
      accepted: 0,
      read: false,
      icon: 'radio-button-off'
    },
    {
      id: 2,
      title: 'Demand 2',
      start: '12/03/2019 à 10h',
      end: '15/03/2019 à 10h',
      duree: '3 jours',
      prix: '120 euros',
      rdv: '10h à Aéroport de XXXX',
      apermis: 'XX années',
      accepted: 1,
      read: true,
      icon: 'checkmark-circle'
    }
  ];

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
  unreadD = 1;
  unreadN = 2;
  constructor(private elem: ElementRef , public glb: GlobalsService) {}
  setRead(val: number) {
    this.unreadN -= 1;
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

  ngOnInit() {
  }

}
