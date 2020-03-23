import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';
import { ReductionsPage } from 'src/app/modals/reductions/reductions.page';
import { ModalController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { MonprofilePage } from 'src/app/client/monprofile/monprofile.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-duser',
  templateUrl: './duser.page.html',
  styleUrls: ['./duser.page.scss'],
})
export class DuserPage implements OnInit {

  constructor(
    public modalController: ModalController,
    public glb: GlobalsService,
    private db: DbinteractionsService,
    private loading:LoadingService,
    private route: Router,) { }

  async ionViewWillEnter() {
      const res = await this.db.fetchUsers( this.glb.user.id);
      if (res && res.status !== 'failure') {
        this.glb.users = res.data;
        this.glb.users.forEach(function(item){
          switch (parseInt(item['role'])) {
            case 0 : 
            item['role'] = "Client";
            break;
            case 1 : 
            item['role'] = "Agency";
            break;
            case 2 : 
            item['role'] = "Admin";
            break;
          }
          switch (parseInt(item['activeAccount'])) {
            case 0 : 
            item['activeAccount'] = "Activated";
            break;
            case 1 : 
            item['activeAccount'] = "Deactivated";
            break;
            case 2 : 
            item['activeAccount'] = "Hidden";
            break;
          }
        })
      }
      console.log(this.glb.users);
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

    async deleteUserAccount(index) {
      this.loading.presentLoading();
      const res = await this.db.deleteUserAccount(index);
      this.loading.dismissLoading();
      console.log(res);
      if (res.message === 'Success'){   
        this.close();
      }
    } 

    async de_activateAccount(index) {
      this.loading.presentLoading();
      const res = await this.db.de_activateAccount(index);
      this.loading.dismissLoading();
      console.log(res);
      if (res.message === 'Success'){ 
        console.log(index);
        let elem = document.getElementById('activaccount'+index);
        elem.textContent = res.data;
        this.close();
      }
    }
    
    async modifyAccount(index) {
      this.loading.presentLoading();
      const resProfil = await this.db.fetchProfilInfo(index);
      this.loading.dismissLoading();
      //console.log(res);
      if (resProfil.message === 'Success'){   
        this.glb.user_modify= resProfil.data;
        console.log(this.glb.user_modify);
        this.route.navigate(['dashboard', 'profile']);
      }   
    }



    async fetchAgencies(index) {
  
    }



  ngOnInit() {}

}
