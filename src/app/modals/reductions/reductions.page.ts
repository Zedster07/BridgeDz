import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-reductions',
  templateUrl: './reductions.page.html',
  styleUrls: ['./reductions.page.scss'],
})
export class ReductionsPage implements OnInit {
  type = '1';
  data = {
    index: 0,
    id: -1,
    code: '',
    name: '',
    status: '',
    type: '1',
    value: '',
    debut: '',
    fin: ''
  };

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private loading: LoadingService,
    private db: DbinteractionsService) { }
  close() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  async updateBR(request: string) {
    this.loading.presentLoading();
    const res = await this.db.addBR(request , this.data);
    console.log(res);
    if (res.message === 'Success') {
      this.loading.dismissLoading();
      this.close();
    }
  }

  getTitle() {
    if (this.type === '1') {
      return 'Ajouter un Bon';
    } else {
      return 'Modifier un Bon';
    }
  }


  getType() {
    if (this.data.type === '1') {
      return '%';
    } else {
      return '€';
    }
  }

  ngOnInit() {
    this.type = this.navParams.get('type');
    if (this.type === '2') {
      this.data = this.navParams.get('data');
    }

  }

  async ionViewWillEnter() {
    console.log('view enter');
  }

}
