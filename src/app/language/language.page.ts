import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {

  constructor(
    public glb: GlobalsService,
    private router: Router,
    private angularFireAuth: AngularFireAuth,
    private db: DbinteractionsService,
    private authser: LoginService,
    private lang :TranslateService
  ) { }

  dissmisPopover() {
    this.glb.popover.dismiss(this.glb.currentLang);
  }


  
  

  chooseLang(index) {

    if (index !==''){
      this.glb.currentLang = index;
      this.lang.use(this.glb.currentLang ); 
      this.lang.get(['MONTH.YEAR_BEFOR',
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
                         'INDICATOR.PRICE_MEAN',
                         'EVENT.PICKUP_TITLE',
                         'EVENT.PICKUP_MSG',
                         'EVENT.GIVEN_TITLE',
                         'EVENT.GIVEN_MSG',
                         'EVENT.INSU_EXP_TITLE',
                         'EVENT.INSU_EXP_MSG',
                         'EVENT.CONT_EXP_TITLE',
                         'EVENT.CONT_EXP_MSG',
                         'EVENT.AGEN_TITLE',
                         'EVENT.AGEN_MSG',
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
                          for (let i=0; i<this.glb.events.length; i++){
                            switch (this.glb.event_agency[i]['type']){

                              case '0':
                                this.glb.events[i]['title'] =
                                   val['EVENT.GIVEN_TITLE'] +
                                  this.glb.event_agency[i]['car_name'] + ' ' +
                                  this.glb.event_agency[i]['car_vin'] + ' '+ 
                                  this.glb.event_agency[i]['hour'] + ' '+
                                  val['EVENT.GIVEN_MSG'];
                                break;
                              case '1':
                                this.glb.events[i]['title'] =
                                  val['EVENT.PICKUP_TITLE'] +
                                  this.glb.event_agency[i]['car_name'] + ' ' +
                                  this.glb.event_agency[i]['car_vin'] + ' '+ 
                                  this.glb.event_agency[i]['hour'] + ' '+
                                  val['EVENT.PICKUP_MSG'];
                                break;
                              case '2':
                                this.glb.events[i]['title'] =
                                  val['EVENT.INSU_EXP_TITLE'] +
                                  this.glb.event_agency[i]['car_name'] + ' ' +
                                  this.glb.event_agency[i]['car_vin'] + ' '+ 
                                  this.glb.event_agency[i]['hour'] + ' '+
                                  val['EVENT.INSU_EXP_MSG'];
                                break;
                              case '3':
                                this.glb.events[i]['title'] =
                                  val['EVENT.CONT_EXP_TITLE'] +
                                  this.glb.event_agency[i]['car_name'] + ' ' +
                                  this.glb.event_agency[i]['car_vin'] + ' '+ 
                                  this.glb.event_agency[i]['hour'] + ' '+
                                  val['EVENT.CONT_EXP_MSG'];
                                break;
                              case '4':
                                this.glb.events[i]['title'] =
                                  val['EVENT.AGEN_TITLE'] +
                                  this.glb.event_agency[i]['car_name'] + ' ' +
                                  this.glb.event_agency[i]['car_vin'] + ' '+ 
                                  this.glb.event_agency[i]['hour'] + ' '+
                                  val['EVENT.AGEN_MSG'];
                                break;
                            }
                          }
                        } );
    }  
      this.glb.popover.dismiss(this.glb.currentLang);

  } 

  ngOnInit() {
  }

}
