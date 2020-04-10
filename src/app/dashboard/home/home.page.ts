import { Component, OnInit } from '@angular/core';
import {TranslateService, TranslatePipe, TranslateModule} from '@ngx-translate/core';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { UtilService } from 'src/app/services/util.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color, SingleDataSet, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { NgxGaugeModule } from 'ngx-gauge';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  barChartOptions: ChartOptions = {
    responsive: true,
    
  };
  pieChartOptions: ChartOptions = {
    responsive: true,
  };
  gaugeType = "arch";
  gaugeValue = 28.3;
  gaugeAppendText = "‎€";
  foregroundColor="#4e73df";
  backgroundColor='#5a5c69';
  size = 15;
  type= "full";
  cap="round";
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], backgroundColor: '#4e73df', hoverBackgroundColor: '#6610f2', label: 'WALLET.INSIDE_BRIDGY' },
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], backgroundColor: '#858796', hoverBackgroundColor: '#5a5c69',  label: 'WALLET.OUTSIDE_BRIDGY' }
  ];
  pieChartData: SingleDataSet = [30, 500];
  pieColor: Color[] =  [{backgroundColor: '#4e73df', hoverBackgroundColor: '#6610f2' },
                        {backgroundColor: '#858796', hoverBackgroundColor: '#5a5c69' }];
  
  bpiChartData: ChartDataSets[] = [
    { data: [30, 50], backgroundColor: ['#4e73df', '#858796'], hoverBackgroundColor: ['#6610f2', '#5a5c69'] }];     

  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [];

  car_perf = [];
  car_perf_display = [];
  car = [];
  booking = [];
  wallet = [];
  historical_wallet = [];
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
    theo_balance : 0,
  }


  constructor(
    public translate: TranslateModule,
    private translator: TranslateService,
    private loading: LoadingService,
    private db: DbinteractionsService,
    public glb: GlobalsService,
    public util: UtilService,



  ) { 
    monkeyPatchChartJsLegend();
    monkeyPatchChartJsTooltip();

  }

  


  async ionViewWillEnter() {  
    this.initialize();
    this.translator.get(['MONTH.YEAR_BEFOR',
                         'MONTH.JANUARY',
                         'MONTH.FEBRUARY',
                         'MONTH.MARCH',
                         'MONTH.APRIL',
                         'MONTH.MAI',
                         'MONTH.JUNE',
                         'MONTH.JULY',
                         'MONTH.AUGUST',
                         'MONTH.SEPTMBER',
                         'MONTH.OCOTOBER',
                         'MONTH.NOVOMBER',
                         'MONTH.DECEMBER',
                         'WALLET.OUTSIDE_BRIDGY',
                         'WALLET.INSIDE_BRIDGY',
                         'INDICATOR.NBR_RENTING',
                         'INDICATOR.PRICE_MEAN'
                         ]).subscribe(val => {
                          this.glb.barChartLabels[0] = val['MONTH.YEAR_BEFOR'];
                          this.glb.barChartLabels[1] = val['MONTH.JANUARY'];
                          this.glb.barChartLabels[2] = val['MONTH.FEBRUARY'];
                          this.glb.barChartLabels[3] = val['MONTH.MARCH'];
                          this.glb.barChartLabels[4] = val['MONTH.APRIL'];
                          this.glb.barChartLabels[5] = val['MONTH.MAI'];
                          this.glb.barChartLabels[6] = val['MONTH.JUNE'];
                          this.glb.barChartLabels[7] = val['MONTH.JULY'];
                          this.glb.barChartLabels[8] = val['MONTH.AUGUST'];
                          this.glb.barChartLabels[9] = val['MONTH.SEPTMBER'];
                          this.glb.barChartLabels[10] = val['MONTH.OCOTOBER'];
                          this.glb.barChartLabels[11] = val['MONTH.NOVOMBER'];
                          this.glb.barChartLabels[12] = val['MONTH.DECEMBER'];
                          this.glb.barChartData[1]['label'] = val['WALLET.OUTSIDE_BRIDGY'];
                          this.glb.barChartData[0]['label'] = val['WALLET.INSIDE_BRIDGY'];
                          this.glb.pieChartLabels[0] = val['WALLET.INSIDE_BRIDGY'];
                          this.glb.pieChartLabels[1] = val['WALLET.OUTSIDE_BRIDGY'];
                          this.glb.gaugeLabel_rent = val['INDICATOR.NBR_RENTING'];
                          this.glb.gaugeLabel_price = val['INDICATOR.PRICE_MEAN'];
                        } );

                      
    // retreive dashboard home data
    this.loading.presentLoading();
    let agncy_id = this.glb.AgencyLogData.id;
    if(this.glb.ifAdmin(this.glb.user.role)){
      agncy_id ='-1';
    }   

    const res = await this.db.fetchCars(this.glb.AgencyLogData.id, this.glb.user.id);
    const res_booking = await this.db.fetchBooking('-1', agncy_id);
    const res_wallet = await this.db.fetchWallet(agncy_id, this.glb.user.id);
    
    
    if(res.status = 'success'){
      this.car = res.data;
    }
    if(res_booking.status = 'success'){
      this.booking = res_booking.data;
    }

    if (res_wallet.status = 'success') {
      this.wallet = res_wallet.data;
      const res_historical_wallet = await this.db.fetchHistoricalWallet(agncy_id, this.glb.user.id, this.wallet['id']);
      if (res_historical_wallet.status = 'success') {
        this.historical_wallet = res_historical_wallet.data;
        this.prepareHistoricalRevenu();
      
      }
    }
    this.util.debug(this.wallet);
    this.util.debug(this.historical_wallet);
    this.buildPerfCars();
    this.fillSummarizeInfo();
    
    this.util.debug(this.glb.barChartData);
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
    if (this.wallet.length !== 0){
      this.summariez_info.real_balance = this.wallet['realBalance'];
      this.summariez_info.theo_balance = this.wallet['theoBalance'];
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


  prepareHistoricalRevenu(){
    
    let xx = this.util.getYearString();
    this.util.debug(xx);
    for (let i =0; i < this.historical_wallet.length; i++){
      if (this.historical_wallet[i]['year'] === this.util.getYearString()){
          this.glb.barChartData[this.historical_wallet[i]['type']]['data'][this.historical_wallet[i]['month']] = parseInt(this.historical_wallet[i]['value']);   
      } else {
        this.glb.barChartData[this.historical_wallet[i]['type']]['data'][0] = parseInt(this.historical_wallet[i]['value']);
      } 
    }  
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

  initialize(){
    for (let i=0; i<this.barChartData[0]['data'].length ; i++){
      this.barChartData[0]['data'][i] = 0;
    }  
    for (let i=0; i<this.bpiChartData[0]['data'].length; i++) {
      //this.bpiChartData[0]['data'][i] = 0;
    } 
    this.summariez_info.free_car =0;
    this.summariez_info.real_balance = 0;
    this.summariez_info.rented_car = 0;
    this.summariez_info.theo_balance = 0;
  }

  ionViewWillLeave(){
    this.initialize();
  } 
}
