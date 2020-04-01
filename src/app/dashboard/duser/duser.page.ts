import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';
import { UtilService } from 'src/app/services/util.service';
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

  usrNbr = 0;

  constructor(
    public modalController: ModalController,
    public glb: GlobalsService,
    public util: UtilService,
    private db: DbinteractionsService,
    private loading:LoadingService,
    private route: Router,) {
      console.log(this.util.dsiplayRole("1"));
     }

  async ionViewWillEnter() {
      const res = await this.db.fetchUsers( this.glb.user.id);
      if (res && res.status !== 'failure') {
        this.glb.users = res.data;
        for (let i = 0; i < this.glb.users.length ; i++) {
          this.glb.users[i]['role'] = this.util.dsiplayRole(this.glb.users[i]['role']);
          this.glb.users[i]['activeAccount'] = this.util.dsiplayStatus(this.glb.users[i]['activeAccount']);
          this.glb.users[i]['visible'] = true;
        }
        this.usrNbr = this.glb.users.length;
      }
      console.log(this.glb.users);
    }

    filter(){
      const pass = document.getElementById("search") as HTMLInputElement;
      console.log(pass.value);
      
      if (pass.value ==='') {
      this.usrNbr = this.glb.users.length;
      for (let i=0; i<this.glb.users.length ; i++){
          this.glb.users[i]['visible'] = true;
        } 
      } else {
        this.usrNbr  = 0;
        for (let i=0; i<this.glb.users.length ; i++){
          if (!this.glb.users[i]['lname'].includes(pass.value) &&
           !this.glb.users[i]['fname'].includes(pass.value) && 
           !this.glb.users[i]['email'].includes(pass.value) &&
           !this.glb.users[i]['username'].includes(pass.value)&&
           !this.glb.users[i]['activeAccount'].includes(pass.value) && 
           !this.glb.users[i]['role'].includes(pass.value) ) {
            console.log("let's check");
            this.glb.users[i]['visible'] = false;
          } else {
            this.glb.users[i]['visible'] = true;
            this.usrNbr++;
          }
      }
    }
    }

    byStatus(){
     // this.glb.users.sort(function(a,b){ return a['activeAccount'] - b['activeAccount'] });
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
      console.log(this.glb.users);
      if (res.status === 'Success'){   
        for (let i = 0; i < this.glb.users.length ; i++) {
          if (this.glb.users[i]['id'] === index)
          {
            this.glb.users.splice(i, 1);
          } 
        }
        console.log(this.glb.users);
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
        elem.textContent = this.util.dsiplayStatus(res.data);
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

    async displayInfo(index) {    
        this.route.navigate(['dashboard']);
        
    }

    async displayCar(index) {  
      this.loading.presentLoading();
      const res = await this.db.fetchCarsUsers(index, this.glb.user.id);
      this.loading.dismissLoading();
      if (res.status === 'success'){   
        this.glb.myCars = res.data;
        this.glb.isViewCars = true;
        this.route.navigate(['dashboard', 'voitures']);
      } 
  }

    async displayAgency(index) {
      this.loading.presentLoading();
      const res = await this.db.fetchAgenciesUser(index, this.glb.user.id);
      this.loading.dismissLoading();
      if (res.status === 'success'){   
        this.glb.agencies = res.data;
        this.glb.isViewAgency = true;
        this.route.navigate(['dashboard', 'dagency']);
      } 
  
    }


    async displayRenting(index) {
     /* this.loading.presentLoading();
      const res = await this.db.fetchAgenciesUser(index, this.glb.user.id);
      this.loading.dismissLoading();
      if (res.status === 'success'){   
        this.glb.agencies = res.data;
        this.glb.isViewAgency = true;
        this.route.navigate(['dashboard', 'dagency']);
      } */
      this.route.navigate(['dashboard', 'locations']);
  
    }

    async displayWallet(index) {
      /* this.loading.presentLoading();
       const res = await this.db.fetchAgenciesUser(index, this.glb.user.id);
       this.loading.dismissLoading();
       if (res.status === 'success'){   
         this.glb.agencies = res.data;
         this.glb.isViewAgency = true;
         this.route.navigate(['dashboard', 'dagency']);
       } */
       this.route.navigate(['dashboard', 'wallet']);
   
     }



  ngOnInit() {}

}
