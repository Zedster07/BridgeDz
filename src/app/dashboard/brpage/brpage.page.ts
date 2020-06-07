import { Component, OnInit } from '@angular/core';
import { ReductionsPage } from 'src/app/modals/reductions/reductions.page';
import { ModalController } from '@ionic/angular';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { UtilService } from 'src/app/services/util.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-brpage',
  templateUrl: './brpage.page.html',
  styleUrls: ['./brpage.page.scss'],
})
export class BrpagePage implements OnInit {
  ifAdmin = false;
  ismobile = false;
  bonredList = [{
    index: 0,
    id: 0,
    code: '',
    name: '',
    status: '',
    type: '',
    value: '',
    debut: '',
    fin: '',
  },
  ];
  constructor(
    private modalController: ModalController,
    private loading: LoadingService,
    private db: DbinteractionsService,
    private alertt: AlertService,
    public glb: GlobalsService,
    public util: UtilService) { }
  async showAddReductions() {
    const modal = await this.modalController.create({
      component: ReductionsPage,
      cssClass: 'my-modal',
      // backdropDismiss: false,
      componentProps: {
        type: '1'
      }
    });
    await modal.present();
    modal.onDidDismiss().then(() => {
      this.fetchBR();
    });

  }

  async delReduction(i) {
    let id = this.db.getStorage('accID');
    this.loading.presentLoading_generic('LOGIN.LOADING_WAIT'); //TODO
    if (this.glb.ifAdmin(this.glb.user.role)) {
      id = this.glb.agency_modify['id'];
    }
    const res = await this.db.delBR(this.bonredList[i].id, id);
    if (res) {
      this.alertt.presentAlert('POPUP.BR_DELETE_TITLE' , 'POPUP.BR_DELETE_MSG');
      this.fetchBR();
    } else {
      this.alertt.presentAlert('POPUP.BR_DELETE_TITLE' , 'POPUP.BR_DELETE_ERROR_MSG');
    }
    this.loading.dismissLoading();
  }

  async showEditReductions(id: number) {
    const modal = await this.modalController.create({
      component: ReductionsPage,
      // backdropDismiss: false,
      componentProps: {
        type: '2',
        data: this.bonredList[id]
      }
    });
    await modal.present();
    modal.onDidDismiss().then(() => {
      this.fetchBR();
    });
  }
  getType(id: number) {
    if (this.bonredList[id].type === '1') {
      return '%';
    } else {
      return '€';
    }
  }

  getClass(id: number) {
    switch (this.bonredList[id].status) {
      case 'ACTIVATED':
        return 'text-success';
        break;
      case 'DEACTIVATED':
        return 'text-warning';
        break;
      case 'DEPRICATED':
        return 'text-danger';
        break;
      case 'HIDDEN':
        return 'text-danger';
        break;
    }

  }
  ngOnInit() {
  }
  async fetchBR() {
    let id = this.db.getStorage('accID');
    const bnredListtmp = [];
    this.loading.presentLoading_generic('LOGIN.LOADING_WAIT'); //TODO
    if (this.glb.ifAdmin(this.glb.user.role)) {
      id = '';
    }
    const res = await this.db.fetchBR(id, this.glb.user.id);
    if (res.status === 'success'){
    const data = res.data;
    console.log(data);
    let i = 0;
    while (i < data.length) {
      const tmp = {
        index: i,
        id: data[i]['id'],
        code: data[i]['code'],
        name: data[i]['name'],
        status: this.util.dsiplayStatus(data[i]['status']),
        type: data[i]['type'],
        value: data[i]['value'],
        debut: data[i]['startDate'],
        agencyID: data[i]['agencyID'],
        fin: data[i]['endDate']
      };
      bnredListtmp.push(tmp);
      i++;
     }
     this.bonredList = bnredListtmp;
     this.loading.dismissLoading();
    } else {
    this.loading.dismissLoading();
    }
    
  }

  async ionViewWillEnter() {
    this.bonredList = [];
    if (window.screen.width <= 360) {
      this.ismobile = true;
    } else {
      this.ismobile = false;

    }
    const res = await this.fetchBR();
  }
}
