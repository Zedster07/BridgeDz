import { Component, OnInit, ElementRef } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
@Component({
  selector: 'app-cnotifications',
  templateUrl: './cnotifications.page.html',
  styleUrls: ['./cnotifications.page.scss'],
})
export class CnotificationsPage implements OnInit {


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

  unreadD = 1;
  unreadN = 2;
  constructor(private elem: ElementRef , public glb: GlobalsService, private db: DbinteractionsService) {}
  acceptDemand(val: number) {
    this.demandeLoc[val - 1].accepted = 1;
    this.demandeLoc[val - 1].read = true;
    const elem = document.getElementById('item-dem-' + val);
    const nicon = elem.firstElementChild;
    nicon.setAttribute('name' , 'checkmark-circle');
    this.unreadD -= 1;
  }

  rejectDemand(val: number) {
    this.unreadD -= 1;
    this.demandeLoc[val - 1].accepted = -1;
    this.demandeLoc[val - 1].read = true;
    const elem = document.getElementById('item-dem-' + val);
    elem.remove();
  }
  setRead(val: number) {
    this.db.setRead(val);
    this.glb.unreadNotif -= 1;
    this.glb.notifications[val].icon = 'checkmark-circle';
    // this.notifications[val - 1].icon = 'checkmark-circle';
    // this.notifications[val - 1].read = false;
    // const elem = document.getElementById('item-' + val);
    // const nicon = elem.firstElementChild;
    // nicon.setAttribute('name' , 'checkmark-circle');
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
