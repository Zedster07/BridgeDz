import { Component, OnInit } from '@angular/core';
import {TranslateService, TranslatePipe, TranslateModule} from '@ngx-translate/core';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  car_perf = [];
  car_perf_display = [];
  car = [];
  booking = [];
  booking_state = {
    done: 0,
    cancled: 0,
    waiting_for_validation: 0,
    verified :0,
    on_going :0
  };
  index_perf  = 0;
  display_all = 0;
  booking_state_c= {
    done: '',
    cancled: '',
    waiting_for_validation: '',
    verified :'',
    on_going :'',
  } 
  summariez_info = {
    rented_car : 0,
    free_car : 0,
    real_balance : 0,
    theo_Balance : 0,
  }

  constructor(
    public translate: TranslateService,
    private loading: LoadingService,
    private db: DbinteractionsService,
    public glb: GlobalsService,
    public util: UtilService

  ) { 

  }


  async ionViewWillEnter() {
    // retreive dashboard home data
    this.loading.presentLoading();
    const res = await this.db.fetchCars(this.glb.AgencyLogData.id, this.glb.user.id);
    const res_booking = await this.db.fetchBooking('-1', this.glb.AgencyLogData.id);
    if(res.status = 'success')
    {
      this.car = res.data;
    }
    if(res_booking.status = 'success')
    {
      this.booking = res_booking.data;
    }
    
    this.buildPerfCars();
    this.fillSummarizeInfo();
    this.loading.dismissLoading();
  }
  
  fillSummarizeInfo(){
    const today = new Date();
    const str = today.getFullYear().toString() +'/' + (today.getMonth()+1).toString() +'/' + (today.getDate()).toString();
    for(let i =0 ; i < this.car.length ; i++){ 
      if ((this.car[i]['busy']).includes(str) || (this.car[i]['prebooked']).includes(str))  
      { 
          this.summariez_info.rented_car++;
      } else {
          this.summariez_info.free_car++;
      }
    }
  }
  buildPerfCars(){
    for(let i =0 ; i < this.car.length ; i++){ 
       let nbr_renting  = 0;
       let sum = 0;
       for (let j=0; j< this.booking.length ; j++){
        if (this.car[i]['id'] === this.booking[j]['vehicleID']){
          nbr_renting = nbr_renting + 1;
          sum = sum + parseFloat(this.booking[j]['totalPrice']);
         }  
       }
       const tmp = {
        index :i,
        model : this.car[i]['model'],
        matricule :this.car[i]['brand'],
        nbr_renting :nbr_renting,
        sum: sum,
       } 
    this.car_perf.push(tmp);
    } 
    this.sortNbrRenting();
    this.buildBookingInState();
  }

  buildBookingInState(){
    for (let i= 0; i< this.booking.length ; i++){
      switch (this.booking[i]['status']){
        case '0':
          this.booking_state.done++;
        break;
        case '1':
          this.booking_state.cancled++;
        break;
        case '2':
          this.booking_state.waiting_for_validation++;
        break;
        case '3':
          this.booking_state.verified++;
        break;
        case '4':
          this.booking_state.on_going++;
        break;
      }   
    } 
    
    let max = this.maxStatus();  
    this.booking_state_c.done = ((this.booking_state.done / max) * 100).toString() +'%';
    this.booking_state_c.cancled = ((this.booking_state.cancled / max) * 100).toString() +'%';
    this.booking_state_c.waiting_for_validation = ((this.booking_state.waiting_for_validation / max) * 100).toString() +'%';
    this.booking_state_c.verified = ((this.booking_state.verified / max) * 100).toString() +'%';
    this.booking_state_c.on_going = ((this.booking_state.on_going / max) * 100).toString() +'%';
  }  
  buildBookingOutState(){

  } 
  
  maxStatus (){
    let max = this.booking_state.done;
    if (max < this.booking_state.cancled){
      max = this.booking_state.cancled;
    } 
    if (max < this.booking_state.waiting_for_validation){
      max = this.booking_state.waiting_for_validation;
    }  
    if (max < this.booking_state.verified){
      max = this.booking_state.verified;
    } 
    if (max < this.booking_state.on_going){
      max = this.booking_state.on_going;
    }  
    return max;
  }  

  sortNbrRenting(){
    this.car_perf_display=[];
    this.car_perf.sort((a, b)=> b.nbr_renting - a.nbr_renting);
    let index =this.car_perf.length > 6 ? 6 : this.car_perf.length;
    if(this.display_all === 0){
      for (let i =0; i<index; i++){
        this.car_perf_display.push(this.car_perf[i]);
      }
    } else {
      this.car_perf_display = this.car_perf;
    } 
  } 

  sortSum(){
    this.car_perf_display=[];
    this.car_perf.sort((a, b)=> b.sum - a.sum);
    let index =this.car_perf.length > 6 ? 6 : this.car_perf.length;
    if(this.display_all === 0){
       for (let i =0; i<index; i++){
      this.car_perf_display.push(this.car_perf[i]);
    } 
  } else {
    this.car_perf_display = this.car_perf;
  } 
}

  displayAll(){
    if(this.display_all === 0){
        this.display_all = 1;
        this.sortNbrRenting();
    } else {
      this.display_all = 0;
      this.sortNbrRenting();
    } 
  } 
  

  


  ngOnInit() {
  }
 
}
