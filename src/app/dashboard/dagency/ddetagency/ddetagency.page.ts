import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';
import { ReductionsPage } from 'src/app/modals/reductions/reductions.page';
import { LoadingService } from 'src/app/services/loading.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { ModalController } from '@ionic/angular';
import { AlertService } from '../../../services/alert.service';
import { LoginService } from '../../../services/login.service';
import { UtilService } from '../../../services/util.service';
import { UserData } from '../../../interfaces/user-data';
import { AgencyData } from '../../../interfaces/agency_data';
import { CarData } from '../../../interfaces/car_data';
import { Router } from '@angular/router';


@Component({
  selector: 'app-ddetagency',
  templateUrl: './ddetagency.page.html',
  styleUrls: ['./ddetagency.page.scss'],
})
export class DdetagencyPage implements OnInit {

  tabVal = 'edit';
  isAdmin = false;
  recto_temp = false;
  verso_temp = false;
  profilePicFormat: string;
  verified = this.glb.user.userStatus;
  emptyFormdata = new FormData();

  accparams: any = {
    demandlocation: [false , false , false],
    redemandlocation: [false , false , false],
    locAccept: [false , false , false],
    loccancel: [false , false , false],
    locrappel: [false , false , false],
    emailpromo: [false , false , false]
  };


  public usertmp: UserData  = {
    type: '',
    id: '',
    fname: '',
    lname: '',
    username: '',
    email: '',
    phoneNumber: '',
    pic: '',
    password: '',
    dob: '',
    pob: '',
    address: '',
    country: '',
    ville: '',
    codeP: '',
    propos: '',
    userStatus: '',
    role:'',
    session_guid: '',
    licenseId: '',
    dlicencePaye: '',
    dlicenceDate: '',
    licenseRecot: '',
    licenseVerso: ''
   };

  updateKbis = {
    rectoimg: this.emptyFormdata,
    versoimg: this.emptyFormdata
  };



  constructor(
    public glb: GlobalsService ,
    public util: UtilService,
    private log: LoginService,
    private db: DbinteractionsService,
    private modalController: ModalController,
    private alertt: AlertService,
    private loading: LoadingService,
    private route: Router) { }


  setTabVal( val: string) {
    this.tabVal = val;
  }


  getFrontPic(car: any) {
    const piclist = car['picturesList'];
    return this.glb.hostServer + piclist.substring( 0 , piclist.indexOf(','));
  }
  
  showTab(val: string): boolean {
    if (val === this.tabVal) {
      return true;
    }
    return false;
  }

  changedDOB() {
    this.usertmp.dob = this.usertmp.dob.split('T')[0];
  }


  async updateRibInfo() {
    this.loading.presentLoading();
    this.glb.rib_modify['pay_choice'] = this.util.getRaidoButtonChoice("pay");
    const res = await this.db.updateRibInfo();
    this.loading.dismissLoading();
    if (res.message === 'Success'){  
      this.glb.rib_modify =  res.data;
    }
  }

  

  updateAgencyInfo() {
  }

  modifyCancel() {
  }


  changepic2(imghandler: string , filehandler: string) {
    const elem = document.getElementById(filehandler);
    elem.click();
   
    elem.onchange = () => {
      const file = (<HTMLInputElement>document.getElementById(filehandler)).files[0];
      let preview = document.getElementById(imghandler) as HTMLImageElement;
      

      const reader  = new FileReader();
      reader.onloadstart = () => {
        this.loading.presentLoading();
      };
      reader.onload = () => {
        const formdata = new FormData();
        formdata.append('file' , file);
        preview.src = reader.result as string;
        if (filehandler === 'rectoid') {
          this.updateKbis.rectoimg = formdata;
        } else {
          this.updateKbis.versoimg = formdata;
        }
      };
      reader.onloadend = () => {
        this.loading.dismissLoading();
      };
      reader.readAsDataURL(file);
    };
  }

  async updateKbisInfo() {

      this.loading.presentLoading();
      const recto = await this.db.uploadLicence(this.updateKbis.rectoimg);
      if ( !recto ) {
        this.loading.dismissLoading();
        this.alertt.presentAlert('Error!' , 'Something Went wrong, Please try again later.');
      } else {
        const verso = await this.db.uploadLicence(this.updateKbis.versoimg);
        if ( !verso ) {
          this.loading.dismissLoading();
          this.alertt.presentAlert('Error!' , 'Something Went wrong, Please try again later.');
        } else {
          const LiImgPaths = {
            rectoimg: recto['path'] ,
            versoimg: verso['path']
          };
          const result = await this.db.updateKbisInfo(LiImgPaths);
          if (result.status === 'success')  {
            this.glb.kbis_modify = result.data;
          }
          this.loading.dismissLoading();
        }
      }

  }

  async ionViewWillEnter() {
    if (this.glb.kbis_modify['picture_recto'] === ''){
      this.recto_temp = true;
    }
    if (this.glb.kbis_modify['picture_verso'] === ''){
      this.verso_temp = true;
    }

  }

  async showAddReductions() {
    const modal = await this.modalController.create({
      component: ReductionsPage,
      cssClass: 'my-modal',
      componentProps: {
        type: '1'
      }
    });
    await modal.present();
    modal.onDidDismiss().then(() => {
      this.fetchBR();
    });
    
  }

  async fetchBR() {
    let id = this.db.getStorage('accID');
    this.loading.presentLoading();
    if(this.glb.ifAdmin(this.glb.user.role)){
      id = this.glb.agency_modify['id'];
    } 
    const res = await this.db.fetchBR(id, this.glb.user.id);
    if(res.status === 'success'){
      console.log(res);
      this.glb.discounts = res.data;
      for (let i = 0; i< this.glb.discounts.length; i++){
        this.glb.discounts[i]['status'] =  this.util.dsiplayStatus(this.glb.discounts[i]['status']);
      } 
      this.loading.dismissLoading();
    } else {
      this.loading.dismissLoading();
    }   
  }

  async delReduction(id_discount, index){
    let id = this.db.getStorage('accID');
    this.loading.presentLoading();
    if(this.glb.ifAdmin(this.glb.user.role)){
      id = this.glb.agency_modify['id'];
    } 
    const res = await this.db.delBR(id_discount, id);
    if (res.status === 'success'){
      this.glb.discounts.splice(index, 1);
      this.loading.dismissLoading();
    } else {
      this.loading.dismissLoading();
    }   

  }

  async changeDiscountState(id_discount, index){
    this.loading.presentLoading();
    const res = await this.db.updateBRStatus(id_discount);
    if (res.status === 'Success'){
        this.loading.dismissLoading();
        this.glb.discounts[index]['status'] =  this.util.dsiplayStatus(res.data);  
    } else {
      this.loading.dismissLoading();
    } 
  } 

  async showEditReductions(id, index){
    const modal = await this.modalController.create({
      component: ReductionsPage,
      componentProps: {
        type: '2',
        data: this.glb.discounts[id]
      }
    });
    await modal.present();
    modal.onDidDismiss().then(() => {
      this.fetchBR();
    });
  }

  getClass(id: number) {
    switch (this.glb.discounts[id]['status']) {
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

  getType(id: number) {
    if (this.glb.discounts[id].type === '1') {
      return '%';
    } else {
      return '€';
    }
  }

  
  ngOnInit() {
  }

}
