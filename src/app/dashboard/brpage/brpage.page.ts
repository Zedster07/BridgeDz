import { Component, OnInit } from '@angular/core';
import { ReductionsPage } from 'src/app/modals/reductions/reductions.page';
import { ModalController } from '@ionic/angular';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { LoadingService } from 'src/app/services/loading.service';
@Component({
  selector: 'app-brpage',
  templateUrl: './brpage.page.html',
  styleUrls: ['./brpage.page.scss'],
})
export class BrpagePage implements OnInit {
  ismobile = false;
  bonredList = [ {
    index: 0,
    id: 1,
    code: '#582',
    name: 'Mark',
    status: 'In Review',
    type: '2',
    value: '20',
    debut: '10-10-2019',
    fin: '10-11-2019',
  },
  ];
  constructor(
    private modalController: ModalController,
    private loading: LoadingService,
    private db: DbinteractionsService) { }
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
    this.loading.presentLoading();
    const res = await this.db.delBR(this.bonredList[i].id);
    if (res) {
      this.fetchBR();
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
      case 'Active':
        return 'text-success';
        break;
      case 'In Review':
        return 'text-warning';
      case 'Failed':
        return 'text-danger';
    }
  }
  ngOnInit() {
  }
  async fetchBR() {
    const id = this.db.getStorage('accID');
    const bnredListtmp = [];
    this.loading.presentLoading();
    const res = await this.db.fetchBR(id);
    const data = res.data;
    console.log(data);
    let i = 0;
    while (i < data.length) {
      const tmp = {
        index: i,
        id: data[i]['id'],
        code: data[i]['code'],
        name: data[i]['name'],
        status: data[i]['status'],
        type: data[i]['type'],
        value: data[i]['value'],
        debut: data[i]['startDate'],
        fin: data[i]['endDate']
      };
      bnredListtmp.push(tmp);
      i++;
    }
    this.loading.dismissLoading();
    this.bonredList = bnredListtmp;
  }
  async ionViewWillEnter() {
    if (window.screen.width <= 360 ) {
      this.ismobile = true;
    } else {
      this.ismobile = false;
    }
    await this.fetchBR();
  }
}
