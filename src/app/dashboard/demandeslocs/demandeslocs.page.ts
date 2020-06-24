import { Component, OnInit, ElementRef } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { AlertService } from '../../services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';

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
    private router: ActivatedRoute,

    private route: Router,
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

  async ngOnInit() {
    /*let id_booking = '';
    let id_guid = '';
    let resp = '';
    id_booking = this.router.snapshot.paramMap.get('id');
    id_guid = this.router.snapshot.paramMap.get('guid');
    resp = this.router.snapshot.paramMap.get('resp');
    console.log(id_booking);
    console.log(id_guid);
    console.log(resp);
    if (id_booking !== ''  && id_guid !== '' && ( resp === '1' || resp === '-1' )){
      let res = await this.db.answerDemandFromEx(id_booking, id_guid, resp);
      if (res['status'] === 'success'){
        if (resp === '1'){
          console.log(resp);
          console.log('scuess');
           this.alertt.presentAlert('Confirmation de réservation', 'Vous avez confirmé la location.');
        }  else if (resp === '-1'){
          console.log(resp);
          console.log('reject');
          this.alertt.presentAlert('Réservation déclinée', 'Vous avez décliné la réservation');
        } 
      } else {
        console.log(resp);
        console.log('fail');
      }
      if (this.glb.AgencyLogData.loggedin === false){
        this.route.navigate(['dashboard']);
      } 
    }*/
    
    
  }



}
