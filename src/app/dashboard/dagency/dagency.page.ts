import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';
import { ReductionsPage } from 'src/app/modals/reductions/reductions.page';
import { ModalController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { MonprofilePage } from 'src/app/client/monprofile/monprofile.page';
import { UtilService } from 'src/app/services/util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dagency',
  templateUrl: './dagency.page.html',
  styleUrls: ['./dagency.page.scss'],
})
export class DagencyPage implements OnInit {

  agsNbr = 0;

  constructor(
    public modalController: ModalController,
    public glb: GlobalsService,
    private db: DbinteractionsService,
    private loading:LoadingService,
    private route: Router,
    public util : UtilService,
  ) { 
    
  }

  async ionViewWillEnter() {
    if( this.glb.isViewAgency === false)  {
      const res = await this.db.fetchAgencies('', this.glb.user.id);
      if (res && res.status !== 'failure') {
        this.glb.agencies = res.data;
        }
      }
      for (let i = 0; i < this.glb.agencies.length ; i++) {
        this.glb.agencies[i]['status'] = this.util.dsiplayStatus(this.glb.agencies[i]['status']);
        this.glb.agencies[i]['visible'] = true;
      }
      this.agsNbr = this.glb.agencies.length;
   }


  filter(){
    const pass = document.getElementById("search_1") as HTMLInputElement;
    console.log(pass.value);
    
    if (pass.value ==='') {
      console.log("let's check");
      this.agsNbr = this.glb.agencies.length;
      for (let i=0; i<this.glb.agencies.length ; i++){
        this.glb.agencies[i]['visible'] = true;
      } 
    } else {
      this.agsNbr = 0;
      for (let i=0; i<this.glb.agencies.length ; i++){
        if (!this.glb.agencies[i]['name'].includes(pass.value) &&
           !this.glb.agencies[i]['businessEmail'].includes(pass.value) &&
           !this.glb.agencies[i]['bmobile'].includes(pass.value) &&
           !this.glb.agencies[i]['status'].includes(pass.value)) {
          this.glb.agencies[i]['visible'] = false;
        } else {
          this.glb.agencies[i]['visible'] = true;
          this.agsNbr++;
        }
      }
    }
  }

  byStatus(){
    //this.glb.agencies.sort(function(a,b){ return a['status'] - b['status'] });
  }

  close() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  getFrontPic(user: any) {
    const piclist = user['picture'];
    if (piclist.includes("https://") === true ) {
      return piclist;
    } else {
    return this.glb.hostServer + piclist;
  }
  }


  async de_activateAgency(index) {
    this.loading.presentLoading();
    const res = await this.db.de_activateAgency(index);
    this.loading.dismissLoading();
    console.log(res);
    if (res.message === 'Success'){   
      for (let i = 0; i < this.glb.agencies.length ; i++) {
        if (this.glb.agencies[i]['id'] === index)
        {
          this.glb.agencies[i]['status'] = this.util.dsiplayStatus(res.data);
        } 
      }
    }
  }
  
  async ownerClick(index) {
    this.loading.presentLoading();
    const res = await this.db.fetchAgenciesRelatedData(index, this.glb.user.id);
    this.loading.dismissLoading();
    if (res.message === 'sucess'){   
      this.glb.user_modify= res.user;
      this.glb.agency_modify = res.agency;
      this.glb.cars = res.cars;
      this.glb.kbis_modify = res.kbis;
      this.glb.rib_modify = res.rib;
      this.glb.wallet = res.wallet;
      this.glb.discounts = res.discount;
      for (let i = 0; i< this.glb.discounts.length; i++){
        this.glb.discounts[i]['status'] =  this.util.dsiplayStatus(this.glb.discounts[i]['status']);
      } 
      this.route.navigate(['dashboard', 'dagency', 'ddetagency']);
    } 
  }

  async deleteAgencyAccount(index, i) {
    this.loading.presentLoading();
      const res = await this.db.deleteAgencyAccount(index);
      this.loading.dismissLoading();
      if (res.status === 'Success'){   
            this.glb.agencies.splice(i, 1);  
        }
  }

  async ionViewDidLeave() {
    this.glb.isViewAgency = false;
  }




  ngOnInit() {}

}
