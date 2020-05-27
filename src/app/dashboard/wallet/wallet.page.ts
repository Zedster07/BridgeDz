import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { UtilService } from 'src/app/services/util.service';
import { booking_status, paiement_status } from 'src/app/interfaces/booking_status';
import {TranslateService, TranslatePipe, TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  
  wallet = [];
  booking = [];
  histo_wallet = [];

  s_month_h : string;
  s_year :number;
  e_month_h : string;
  e_year :number;
  total;

  tabVal = 'pe';

  constructor(
    public translate: TranslateModule,
    private translator: TranslateService,
    private util : UtilService,
    private db: DbinteractionsService,
    public glb: GlobalsService,
  ) { }

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

  pay(){
  }
   
  async ionViewWillEnter() {
    const resp = await this.db.fetchWallet(this.glb.AgencyLogData.id, this.glb.user.id);
    if(resp['status'] === 'success'){
      this.wallet = resp['data'];
      let s_month:number, s_year:number, e_month:number, e_year:number, s_month_h:string, e_month_h:string;
       s_month= parseInt(this.wallet['next_pay'].split(' ')[0].split('-')[1]);
       s_year= parseInt(this.wallet['next_pay'].split(' ')[0].split('-')[0]);
      if (s_month === 12){
         e_month = 1;
         e_year = s_year + 1;
      } else {
         e_month = s_month + 1;
         e_year  = s_year;
      }
       s_month_h = this.util.monthConvertor(s_month);
       e_month_h = this.util.monthConvertor(e_month);
       this.s_month_h = s_month_h;
       this.s_year = s_year;
       this.e_month_h = e_month_h;
       this.e_year = e_year;
       this.total = parseFloat(this.wallet['outBalance']) + parseFloat(this.wallet['theoBalance']);
      } 
    
    const resp_histo = await this.db.fetchHistoricalWallet(this.glb.AgencyLogData.id,this.glb.user.id, resp['data']['id']);
    if(resp_histo['status'] === 'success'){
      this.histo_wallet = resp_histo['data'];

    }

    const resp_book = await this.db.fetchBookingAgency(this.glb.AgencyLogData.id,this.glb.user.id);
    if(resp_book['status'] === 'success'){
      this.booking = resp_book['data'];
      for (let i = 0; i< this.booking.length; i++){
        switch (parseInt(this.booking[i]['valid_paiement'])){
          case paiement_status.not_validated :
              this.booking[i]['valid_paiement_h'] = 'paiment non validé';
            break;
          case paiement_status.not_yet_validated :
            this.booking[i]['valid_paiement_h'] = 'paiement non encore validé'
            break;
          case paiement_status.refunded :
            this.booking[i]['valid_paiement_h'] = 'paiement validé - comission annulation'
            break;
          case paiement_status.validated :
            this.booking[i]['valid_paiement_h'] = 'paiement valide'
            break;
        }  
     }
    }
    
  }
}
