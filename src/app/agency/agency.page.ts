import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';
import { LoadingService } from 'src/app/services/loading.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { AlertService } from 'src/app/services/alert.service';
import { Router , ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-agency',
  templateUrl: './agency.page.html',
  styleUrls: ['./agency.page.scss'],
})
export class AgencyPage implements OnInit {
  hasAgency = this.glb.hasAgency;
  type = '';
  accountsList = [];
  newAgency = {
    nom: '',
    cdate: '',
    cpays: '0',
    bemail: '',
    bmobile: '',
    address: ''
  };
  constructor(
    public glb: GlobalsService,
    private db: DbinteractionsService,
    private alertt: AlertService,
    private loading: LoadingService , 
    private route: Router,
    private aroute: ActivatedRoute) {

  }

  gotoMyAgency(id: string) {
    this.glb.AgencyLogData.loggedin = true;
    this.glb.AgencyLogData.data = this.accountsList[parseInt(id)];
    this.glb.AgencyLogData.id =  this.accountsList[parseInt(id)]['id'];
    this.glb.AgencyLogData.bemail =  this.accountsList[parseInt(id)]['businessEmail'];
    this.glb.AgencyLogData.name =  this.accountsList[parseInt(id)]['name'];
    console.log(this.glb.AgencyLogData);
    this.route.navigate(['dashboard']);
  }

  async fetchAcc() {
    const res = await this.db.FetchAcc();
    if (res && res['status'] === 'failure') {
      this.hasAgency = false;
      this.route.navigate(['agency' , 'create'] );
    } else {
      console.log(res);
      this.hasAgency = true;
      this.accountsList = res.data;
      if (res['data'].length === 1) {
          this.glb.hasAgency = true;
          this.glb.AgencyLogData.loggedin = true;
          this.glb.AgencyLogData.id = res.data[0]['id'];
          this.glb.AgencyLogData.bemail = res.data[0]['businessEmail'];
          this.glb.AgencyLogData.name = res.data[0]['name'];
          this.glb.AgencyLogData.data = res.data[0];
          if (this.type === null) {
            this.route.navigate(['dashboard']);
          }
      }
    }
  }

  async createAgency() {
    const error = document.getElementById('loginerror');
    if (this.glb.validateEmail(this.newAgency.bemail) === false) {
      error.textContent = 'Entrez une adresse email valide.';
      error.style.display = 'block';
    }
    if (this.glb.validatePhone(this.newAgency.bmobile) === false) {
      error.textContent = 'Entrez un numéro de téléphonr valide.';
      error.style.display = 'block';
    }
    this.loading.presentLoading();
    const res = await this.db.dbcreateAgency(this.newAgency);
    this.loading.dismissLoading();
    if (res) {
      this.route.navigate(['dashboard']);
    }
  }

  async ngOnInit() {
    this.loading.presentLoading();
    this.type = this.aroute.snapshot.paramMap.get('type');
    await this.fetchAcc();
    this.loading.dismissLoading();
  }

  async ionViewWillEnter() {
    this.loading.presentLoading();
    this.type = this.aroute.snapshot.paramMap.get('type');
    await this.fetchAcc();
    this.loading.dismissLoading();
  }

}
