import { Component, OnInit , ViewChild } from '@angular/core';
import { PopoverController, PickerController, ModalController } from '@ionic/angular';
import { AnimationBuilder, PickerOptions } from '@ionic/core';
import { DbinteractionsService } from '../services/dbinteractions.service';
import { ReservePage } from 'src/app/modals/reserve/reserve.page';
import { GlobalsService } from '../services/globals.service';
import { LoginService } from '../services/login.service';
import { UtilService } from '../services/util.service';
import { AlertService } from '../services/alert.service';
import { Router, RouterEvent, ActivatedRoute } from '@angular/router';
import { AgencyModalPage } from '../modals/agency-modal/agency-modal.page';
import { ClientMenuListComponent } from '../client/client-menu-list/client-menu-list.component';
import {TranslateService} from '@ngx-translate/core';
import {booking_state} from '../interfaces/booking_state';
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
  action = false;
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
    private route: ActivatedRoute,
    private router :Router,
    public popoverController: PopoverController,
    public loginSer: LoginService,
    private alertt: AlertService,
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
    if ((new Date(searchRequest.enddate).getTime() < new Date().getTime()) || (new Date(searchRequest.startdate).getTime() < new Date().getTime())){
      this.glb.cars = [];
      this.isLoading = false;
      return;
    }
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


  async ngOnInit() {
    this.glb.isPrevActionBook = true;
    let type = '';
    type = this.route.snapshot.paramMap.get('type');
    let booking = '';
    booking = this.route.snapshot.paramMap.get('id');
    let guid = '';
    guid = this.route.snapshot.paramMap.get('guid');
    let token = '';
    token = this.route.snapshot.paramMap.get('token');
    switch (type){
      case 'checkout' :
            const res = await this.db.fetchInfoForCheckout(booking, guid, token);           
            if (res.status === 'success'){
              if (parseInt(res.data['booking_state']) === booking_state.booked_paid){
                this.alertt.presentAlert('Réservation déja payé' , 'Votre réservation est déja payé et confirmé');
                break;
              }; 
              if ( (parseInt(res.data['booking_state']) === booking_state.cancel_by_Agency) || 
                (parseInt(res.data['booking_state']) === booking_state.cancel_by_client) ||  (parseInt(res.data['booking_state']) === booking_state.cancel_by_platform) ||  
                (parseInt(res.data['booking_state']) === booking_state.declined_agency)  ||  (parseInt(res.data['booking_state']) === booking_state.declined_auto) ){
                  this.alertt.presentAlert('Réservation annulée' , 'Votre réservation est annulée');
                break;
              };
              if ((parseInt(res.data['booking_state']) ===  booking_state.pre_booked_1) ||  (parseInt(res.data['booking_state']) === booking_state.pre_booked_2 )){
                this.alertt.presentAlert('Réservation en attente' , 'Votre réservation doit etre accepté par le loeur');
                break;
              };  
              
              const res_1 = await this.db.fetchCarById(res.data['vehicleID']);
              const res_2 = await this.db.fetchBillingDataByIdAndGuid(booking, guid);
              if (res_1.status === 'success' && res_2.status === 'success'){
                const regex = /-/gi;
                this.glb.searchQuery.enddate = res.data['endDate'];
                this.glb.searchQuery.startdate = res.data['startDate'];
                const debutTimestamp = new Date(this.glb.searchQuery.startdate.replace(regex , '/')).getTime();
                const finTimestamp = new Date(this.glb.searchQuery.enddate.replace(regex , '/')).getTime();
                this.glb.searchQuery.endtime = res.data['end_time'];
                this.glb.searchQuery.starttime = res.data['start_time'];
                this.glb.searchQuery.address = res.data['adress'];
                this.glb.searchQuery.lat = res.data['lat'];
                this.glb.searchQuery.lon = res.data['lon'];
                const ms = finTimestamp - debutTimestamp;
                  let daysdif = ms / 1000;
                  daysdif = daysdif / 60;
                  daysdif = daysdif / 60;
                  daysdif = daysdif / 24;
                  this.glb.daysdif = daysdif;

                  console.log('this.glb.searchQuery.enddate ');
                console.log(this.glb.searchQuery.enddate );
                console.log('this.glb.searchQuery.startdate');
                console.log(this.glb.searchQuery.startdate);
                console.log('finTimestamp');
                console.log(finTimestamp);
                console.log('debutTimestamp');
                console.log(debutTimestamp);
                console.log('this.glb.daysdif');
                console.log(this.glb.daysdif);
                console.log('daysdif');
                console.log(daysdif);
                const book = {
                  totalprice: res.data['totalPrice'],
                  unitPrice : res.data['totalPrice']/this.glb.daysdif,
                  startdate: this.glb.searchQuery.startdate ,
                  starttime : this.glb.searchQuery.starttime,
                  enddate: this.glb.searchQuery.enddate,
                  endtime : this.glb.searchQuery.endtime,
                  adress : this.glb.searchQuery.address,
                  car: res_2.data,
                  days: this.glb.daysdif,
                  idCar: res_1.data['id'],
                  validPaiement : 1,
                  c_id : res.data['clientID']
                };
                console.log('book');
                console.log(book);
            if (!this.loginSer.isLoggedIn()){
                this.glb.isPrevActionBook = false;
                this.glb.daysdif = daysdif;
                this.glb.prevAction = 'book';
                this.glb.prevBook = book;
                this.glb.isPrevActionBookForPaiement = true;
                this.router.navigate(['login']);
              } else {
                console.log(res_1.data);
              const modal = await this.modalController.create({
                component: ReservePage,
                // backdropDismiss: false,
                componentProps: {
                  type: '1',
                  days: this.glb.daysdif,
                  data: res_2.data,
                }
              });
                await modal.present();
            }
          }
        } 


        break;
   
    } 
    this.updateSearch();
    
  }

 

  ionViewWillLeave() {
    this.glb.isSearchPage = false;
  }

  async ionViewWillEnter() {
    this.glb.isSearchPage = true;
    this.glb.isMainPage = false;
   
    if (this.glb.prevAction === 'book' && this.loginSer.isLoggedIn() ){
      this.glb.sync = false;
      let type = '';
      let c_id = '';
      if (this.glb.isPrevActionBookForPaiement){
        this.glb.isPrevActionBookForPaiement = false;
        type = '1';
        c_id = this.glb.prevBook['c_id'];
      }
      this.glb.prevAction = '';
      if (type === '' || (type === '1' && this.glb.user.id === c_id)){
      const modal = await this.modalController.create({
        component: ReservePage,
        // backdropDismiss: false,
        componentProps: {
          type: type,
          days: this.glb.prevBook['days'],
          data: this.glb.prevBook['car'],
        }
      });
      await modal.present();
    }
    }
  
  }


}
