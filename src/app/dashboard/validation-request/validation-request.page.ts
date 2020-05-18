import { Component, OnInit, ElementRef } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { account_status }  from 'src/app/interfaces/account_status'
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-validation-request',
  templateUrl: './validation-request.page.html',
  styleUrls: ['./validation-request.page.scss'],
})
export class ValidationRequestPage implements OnInit {

  tabVal = 'agencies';
  moseov = false;
  iconName = 'radio-button-off';
  validationAgency = [];
  validationVehicle = [];
  validationUser = [];
  display = [];
  unreadD = 1;
  unreadN = 2;
  fileUrl;

  constructor(
    private elem: ElementRef ,
    public glb: GlobalsService,
    private db: DbinteractionsService,
    private sanitizer: DomSanitizer) {
      
    }

  async acceptDemand(val: number, type: number) {
    switch (type){
      case 0 :
        const res_ag = await this.db.validationAgency(account_status.activated , this.validationAgency[val]['id']);
        if (res_ag['status'] === 'success'){
          this.validationAgency.splice(val, 1);
        } 
        break;
      case 1 :
        const res_ve = await this.db.validationVehicle(account_status.activated , this.validationVehicle[val]['id']);
        if (res_ve['status'] === 'success'){
          this.validationVehicle.splice(val, 1);
        } 
        break;
      case 2 :
        const res_us = await this.db.validationUser(account_status.activated , this.validationUser[val]['id']);
        if (res_us['status'] === 'success'){
          this.validationUser.splice(val, 1);
        } 
        break;
    }
  }

  async rejectDemand(val: number, type:number) {
    switch (type){
      case 0 :
        const res_ag = await this.db.validationAgency(account_status.deactivated , this.validationAgency[val]['id']);
        if (res_ag['status'] === 'success'){
          this.validationAgency.splice(val, 1);
        } 
        break;
      case 1 :
        const res_ve = await this.db.validationVehicle(account_status.deactivated , this.validationVehicle[val]['id']);
        if (res_ve['status'] === 'success'){
          this.validationVehicle.splice(val, 1);
        } 
        break;
      case 2 :
        const res_us = await this.db.validationUser(account_status.deactivated , this.validationUser[val]['id']);
        if (res_us['status'] === 'success'){
          this.validationUser.splice(val, 1);
        } 
        break;
    }
  }

  downLoadFile(data: any) {
    let blob = new Blob([data], { type: 'image/jpeg'});
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert( 'Please disable your Pop-up blocker and try again.');
    }
    /*const _data = 'some text';
    const blob = new Blob([_data], { type: 'application/octet-stream' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));*/
  }
  
  setRead(val: number) {
    this.unreadN -= 1;
    const elem = document.getElementById('item-' + val);
    const nicon = elem.firstElementChild;
    nicon.setAttribute('name' , 'checkmark-circle');
  }

  ngOnInit() {
  }

  setTabVal( val: string) {
    this.tabVal = val;
  }

  showTab(val: string): boolean {
    switch (val){
      case 'agencies' :
          this.display = [];
          this.display = this.validationAgency;
        break;
      case 'vehicles' :
          this.display = [];
          this.display = this.validationVehicle;
        break;
      case 'user' :
          this.display = [];
          this.display = this.validationUser;
        break;
    }
    if (val === this.tabVal) {
      return true;
    }
    return false;
  }

  async ionViewWillEnter(){
    const res = await this.db.fetchPendingValidation();
    if (res['status'] === 'success'){
      this.validationAgency = res['agencies'];
      this.validationVehicle = res['vehicles'];
      this.validationUser = res['users'];
    }
    console.log(res);
  }

}
