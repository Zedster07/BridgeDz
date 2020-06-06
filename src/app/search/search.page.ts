import { Component, OnInit , ViewChild } from '@angular/core';
import { PopoverController, PickerController, ModalController } from '@ionic/angular';
import { AnimationBuilder, PickerOptions } from '@ionic/core';
import { DbinteractionsService } from '../services/dbinteractions.service';
import { ReservePage } from 'src/app/modals/reserve/reserve.page';
import { GlobalsService } from '../services/globals.service';
import { LoginService } from '../services/login.service';
import { UtilService } from '../services/util.service';

import { AgencyModalPage } from '../modals/agency-modal/agency-modal.page';
import { ClientMenuListComponent } from '../client/client-menu-list/client-menu-list.component';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  rangeSettings = {
    lower: 250,
    upper: 750
  };
  @ViewChild('finDate' , {static: true} ) finDate;
  @ViewChild('debutDate' , {static: true} ) debutDate;
  todaysDate = new Date();
  cars = [];
  daysdif = 1;
  offset = '0';
  searchFilter = {
    price: {
      lower: 0,
      upper: 1500},
    moteur: 'all',
    clim: false,
    rv: false,
    gps: false,
    sb: false,
    lc: false
  };
  isLoading = true;




  
  constructor(
    private db: DbinteractionsService ,
    public glb: GlobalsService ,
    public modalController: ModalController,
    public popoverController: PopoverController,
    public loginSer: LoginService,
    translate: TranslateService,
    public util: UtilService) { 
  }

  
  async showAgencyModal() {
    const modal = await this.modalController.create({
      component: AgencyModalPage,
      componentProps: {
        type: ''
      }
    });
    return await modal.present();
  }
  async presentPopover(ev: any) {
    const pop = await this.popoverController.create({
      component: ClientMenuListComponent,
      event: ev,
      translucent: false,
    });
    return await pop.present();
  }


  async updateSearch() {
    this.isLoading = true;
    const searchRequest = {
      address : this.glb.searchQuery.address,
      lat: this.glb.searchQuery.lat,
      lon: this.glb.searchQuery.lon,
      startdate: this.glb.searchQuery.startdate.replace('-' , '/').replace('-' , '/'),
      enddate: this.glb.searchQuery.enddate.replace('-' , '/').replace('-' , '/') ,
      starttime: this.glb.searchQuery.starttime ,
      endtime: this.glb.searchQuery.endtime,
      filter: this.searchFilter,
      daysdif: this.glb.daysdif,
      offset: this.offset
    };
    let id = this.glb.user.id;
    if (!this.loginSer.isLoggedIn()){
      id = '0';
    }
    const result = await this.db.fetchSearchreq(id, searchRequest);
    if (result['status'] === 'success') {
      this.glb.cars = result['data'];
      this.isLoading = false;
    } else {
      this.glb.cars = [];
      this.isLoading = false;
    }

  }



  async reserveCar(index) {
  let id = this.glb.user.id;
  if (!this.loginSer.isLoggedIn()){
    id = '0';
  }
  const resp = await this.db.addHistoCar(this.glb.cars[index]['id'], 
                                          index,
                                          this.glb.searchQuery.startdate.replace('-' , '/').replace('-' , '/'),
                                          this.glb.searchQuery.enddate.replace('-' , '/').replace('-' , '/') , 
                                          this.glb.searchQuery.starttime,
                                          this.glb.searchQuery.endtime,
                                          this.searchFilter,
                                          this.glb.daysdif,
                                          this.glb.searchQuery.address);
   
    this.util.debug('this.glb.daysdif RESERVE CAR SEARCH', this.glb.daysdif);
    let CarData = this.glb.cars[index];
    const modal = await this.modalController.create({
      component: ReservePage,
      // backdropDismiss: false,
      componentProps: {
        type: '',
        days: this.glb.daysdif,
        data: CarData
      }
    });
    return await modal.present();
  }



  myFunction() {
    const debutTimestamp = new Date(this.glb.searchQuery.startdate.replace('-' , '/')).getTime();
    const finTimestamp = new Date(this.glb.searchQuery.enddate.replace('-' , '/')).getTime();
    if (debutTimestamp > finTimestamp) {
      console.log("error");
    } else {
      const ms = finTimestamp - debutTimestamp;
      let daysdif = ms / 1000;
      daysdif = daysdif / 60;
      daysdif = daysdif / 60;
      daysdif = daysdif / 24;
      this.daysdif = daysdif;
      //console.log(this.daysdif);
      this.updateSearch();
    }
  }

  getFrontPic(piclist) {
    return this.glb.hostServer + piclist;
  }


  ngOnInit() {
    this.updateSearch();
  }

 

  ionViewWillLeave() {
    this.glb.isSearchPage = false;
  }

  async ionViewWillEnter() {
    this.glb.isSearchPage = true;
    this.glb.isMainPage = false;
    if (this.glb.prevAction === 'book') {
      this.glb.prevAction = '';
      const modal = await this.modalController.create({
        component: ReservePage,
        // backdropDismiss: false,
        componentProps: {
          type: '',
          days: this.glb.prevBook['days'],
          data: this.glb.prevBook['car'],
        }
      });
      await modal.present();
    }
  }


}
