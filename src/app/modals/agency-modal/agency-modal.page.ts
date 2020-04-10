import { Component, OnInit } from '@angular/core';
import { NavParams , ModalController } from '@ionic/angular';
import { GlobalsService } from 'src/app/services/globals.service';
import { LoadingService } from 'src/app/services/loading.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { AlertService } from 'src/app/services/alert.service';
import { Router , ActivatedRoute } from '@angular/router';
import { UtilService} from 'src/app/services/util.service';
@Component({
  selector: 'app-agency-modal',
  templateUrl: './agency-modal.page.html',
  styleUrls: ['./agency-modal.page.scss'],
})
export class AgencyModalPage implements OnInit {
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
    public navParams: NavParams ,
    public glb: GlobalsService,
    private db: DbinteractionsService,
    private alertt: AlertService,
    private loading: LoadingService ,
    private route: Router,
    public modalCtrl: ModalController,
    private aroute: ActivatedRoute,
    private util: UtilService) {
  }

  gotoMyAgency(id: string) {
    this.glb.AgencyLogData.loggedin = true;
    this.glb.AgencyLogData.data = this.accountsList[parseInt(id)];
    this.glb.AgencyLogData.id =  this.accountsList[parseInt(id)]['id'];
    this.glb.AgencyLogData.bemail =  this.accountsList[parseInt(id)]['businessEmail'];
    this.glb.AgencyLogData.name =  this.accountsList[parseInt(id)]['name'];
    this.db.setStorage('accID' , this.glb.AgencyLogData.id);
    this.db.setStorage('accEmail' , this.glb.AgencyLogData.bemail);
    this.db.setStorage('accName' , this.glb.AgencyLogData.name);
    this.db.setStorage('accloggedin' , true);
    this.closeModal();
    this.util.debug('go to my agency');
    this.route.navigate(['dashboard', 'home']);
  }

  async fetchAcc() {
    const res = await this.db.FetchAcc();
    if (res && res['status'] === 'failure') {
      this.hasAgency = false;
      this.showCreate();
     // this.route.navigate(['agency' , 'create'] );
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
            this.closeModal();

            this.route.navigate(['dashboard', 'home']);
          }
      }
    }
  }
  showCreate() {
    this.type = 'create';
  }
  // validate email & phone number 
  async createAgency() {
    const error = document.getElementById('loginerror');
    if (this.glb.validateEmail(this.newAgency.bemail) === false) {
      error.textContent = 'Entrez une adresse email valide.';
      error.style.display = 'block';
      return false;
    }
    if (this.glb.validatePhone(this.newAgency.bmobile) === false) {
      error.textContent = 'Entrez un numéro de téléphonr valide.';
      error.style.display = 'block';
      return false;
    }

    this.loading.presentLoading();
    const res = await this.db.dbcreateAgency(this.newAgency);
    this.loading.dismissLoading();
    if (res) {
      this.closeModal();
      //this.route.navigate(['dashboard']);
    }
  }

  async ngOnInit() {
    this.type = this.navParams.get('type');
    await this.fetchAcc();
  }
  public closeModal() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }
  async ionViewWillEnter() {
    this.type = this.navParams.get('type');
    await this.fetchAcc();
  }

}
