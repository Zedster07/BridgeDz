import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { PopoverController } from '@ionic/angular';
import { GlobalsService } from '../services/globals.service';
import { DashboardMenuListComponent } from './dashboard-menu-list/dashboard-menu-list.component';
import { LoginService } from '../services/login.service';
import { DbinteractionsService } from '../services/dbinteractions.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  pages = [
    {
      title: 'DASHBOARD',
      url: '/dashboard/home',
      icon: 'stats'
    },
    {
      title: 'MON PROFILE',
      url: '/dashboard/profile',
      icon: 'person'
    },
    {
      title: 'MES VOITURES',
      url: '/dashboard/voitures',
      icon: 'car'
    },
    {
      title: 'MON WALLET',
      url: '/dashboard/wallet',
      icon: 'wallet'
    },
    {
      title: 'MES LOCATIONS',
      url: '/dashboard/locations',
      icon: 'list-box'
    },
    {
      title: 'NOTIFICATION',
      url: '/dashboard/notifications',
      icon: 'notifications'
    },
    {
      title: 'DEMANDES DE LOCATIONS',
      url: '/dashboard/demandeslocs',
      icon: 'notifications'
    },
    {
      title: 'Bon de Réduction',
      url: '/dashboard/brpage',
      icon: 'trending-down'
    }
  ];
  ismobile = false;
  selectedPath = '/dashboard/home';
  constructor(
    private router: Router ,
    private angularFireAuth: AngularFireAuth,
    public popoverController: PopoverController,
    public glb: GlobalsService,
    private db: DbinteractionsService,
    private loading: LoadingService,
    private authser: LoginService) {
    this.selectedPath = this.router.url;
    setInterval(() => {
      this.fetchDemandes();
     }, 3000);
  }
  async fetchDemandes() {
    const res = await this.db.fetchDemands(this.glb.AgencyLogData.id);
    console.log(res);
    if (res['status'] === 'success') {
      this.glb.AgencyLogData.demandeLoc = res['data'];
    } else {

    }
  }
  logout() {
    this.router.navigate(['agency' , 'loggedout']);
  }
  dissmisPopover() {
    this.glb.popover.dismiss();
  }

  async presentPopover(ev: any) {
    const pop = await this.popoverController.create({
      component: DashboardMenuListComponent,
      event: ev,
      translucent: false,
    });
    return await pop.present();
  }
  ngOnInit() {
  }
  getData(data , id) {
    let i = 0;
    while (i < data.length ) {
      if (data[i]['id'] === id) {
        return data[i];
      }
      i += 1;
    }
  }
  async ionViewWillEnter() {
    if (window.screen.width <= 360 ) {
      this.ismobile = true;
    } else {
      this.ismobile = false;
    }
    const islogged = this.db.getStorage('accloggedin');
    if (islogged === 'true') {
      this.loading.presentLoading();
      const id = this.db.getStorage('accID');
      const res = await this.db.FetchAcc();
      console.log(this.getData(res.data , id));
      const data = this.getData(res.data , id);
      this.glb.AgencyLogData.id =  data['id'];
      this.glb.AgencyLogData.data = data;
      this.glb.AgencyLogData.name =  data['name'];
      this.glb.AgencyLogData.bemail =  data['businessEmail'];
      this.loading.dismissLoading();
    } else {
      this.router.navigate(['client']);
    }
  }

}
