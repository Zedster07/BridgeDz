import { Component, OnInit , ViewChild, ElementRef } from '@angular/core';
import { PopoverController, PickerController, ModalController } from '@ionic/angular';
import { GlobalsService } from '../services/globals.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { MenuListComponent } from '../menu-list/menu-list.component';
import { UtilService } from '../services/util.service';
import { AgencyModalPage } from '../modals/agency-modal/agency-modal.page';
import { ClientMenuListComponent } from './client-menu-list/client-menu-list.component';
import { LanguagePage } from '../language/language.page';
import { Router } from '@angular/router';
@Component({
  selector: 'app-client',
  templateUrl: './client.page.html',
  styleUrls: ['./client.page.scss'],
})
export class ClientPage implements OnInit {
  respMenu = false;
  path_lang ="";

  constructor(
    private route: Router ,
    public popoverController: PopoverController,
    public glb: GlobalsService,
    public modalController: ModalController,
    private util: UtilService,
    private db: DbinteractionsService) {
      setInterval(() => {
        this.db.fetchNotifications('1');
       }, 3000);
      console.log(this.glb.user);
  }
  dissmisPopover() {
    this.glb.popover.dismiss();
  }
  async presentPopover(ev: any) {
    const pop = await this.popoverController.create({
      component: ClientMenuListComponent,
      event: ev,
      translucent: false,
    });
    return await pop.present();
  }
  ToggleRespMenu(id: any) {

    const lis = document.getElementsByClassName('nav-item');

    for ( var i = 0 ; i < lis.length ; i++ ) {
     
      if(lis[i] != null){
        lis[i].className = 'nav-item';
      }
      
    }
    console.log(this.glb.user.id);
 
    
    document.getElementById(id).className += ' active';
    if ( this.respMenu === false ) {
      const MenuList = document.getElementById('navbarSupportedContent');
      MenuList.style.display = 'block';
      this.respMenu = true;
    } else {
      const MenuList = document.getElementById('navbarSupportedContent');
      MenuList.style.display = 'none';
      this.respMenu = false;
    }
  }
  async showAgencyModal() {
    const modal = await this.modalController.create({
      component: AgencyModalPage,
      componentProps: {
        type: ''
      }
    });
    return await modal.present();
  }

  async selectLang(ev: any) {
    const pop = await this.popoverController.create({
      component: LanguagePage,
      event: ev,
      translucent: false,
    });
    pop.onDidDismiss().then((result) => {
      if(result['data'] !==  undefined) {
        console.log(result['data']);
        this.path_lang = '../../assets/images/' + this.util.getImgLang(result['data']);
      }
    });
    
    const resp = await pop.present(); 
  }

  ionViewWillEnter() {
    this.glb.isMainPage = false;
  }
  ngOnInit() {
    this.glb.globalLoading(false);
  }

}
