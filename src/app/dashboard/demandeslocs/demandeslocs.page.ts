import { Component, OnInit, ElementRef } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-demandeslocs',
  templateUrl: './demandeslocs.page.html',
  styleUrls: ['./demandeslocs.page.scss'],
})
export class DemandeslocsPage implements OnInit {
  tabVal = 'general';
  moseov = false;
  iconName = 'radio-button-off';
  demandeLoc = [];
  unreadD = 1;
  unreadN = 2;
  constructor(
    private elem: ElementRef ,
    public glb: GlobalsService,
    private db: DbinteractionsService,
    private alertt: AlertService,) {
      
    }

  async acceptDemand(val: number) {
    const res = await this.db.answerDemand('1' , this.glb.AgencyLogData.demandeLoc[val]['bookid']);
    if (res['status'] === 'success'){
      this.alertt.presentAlert('POPUP.LOC_REQUEST_RESPONSE_TITLE' , 'POPUP.LOC_REQUEST_RESPONSE_MSG');
      this.glb.AgencyLogData.demandeLoc.splice(val, 1);
    } 

  }

  async rejectDemand(val: number) {
    const res = await this.db.answerDemand('-1' , this.glb.AgencyLogData.demandeLoc[val]['bookid'] );
    if (res['status'] === 'success'){
      this.alertt.presentAlert('POPUP.LOC_REQUEST_RESPONSE_TITLE' , 'POPUP.LOC_REQUEST_RESPONSE_ERROR_MSG');
      this.glb.AgencyLogData.demandeLoc.splice(val, 1);
    } 
    //const elem = document.getElementById('item-dem-' + this.glb.AgencyLogData.demandeLoc[val]['bookid']);
    //elem.remove();
  }

  
  setRead(val: number) {
    this.unreadN -= 1;
    const elem = document.getElementById('item-' + val);
    const nicon = elem.firstElementChild;
    nicon.setAttribute('name' , 'checkmark-circle');
   // elem.className += ' item-read';
  }

  ngOnInit() {

  }

}
