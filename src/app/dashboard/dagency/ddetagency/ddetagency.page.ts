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
import { paiement_status } from '../../../interfaces/booking_status';
import { CarData } from '../../../interfaces/car_data';
import { Router } from '@angular/router';


@Component({
  selector: 'app-ddetagency',
  templateUrl: './ddetagency.page.html',
  styleUrls: ['./ddetagency.page.scss'],
})
export class DdetagencyPage implements OnInit {

  tabVal = 'edit';
  subTabVal = 'pe'
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
    licenseVerso: '',
    status_verified: ''
   };

  updateKbis = {
    rectoimg: this.emptyFormdata,
    versoimg: this.emptyFormdata
  };

  paiement = ['x', 'y'];
  historical_wallet = [];
  wallet = [];
  bookings = [];
  s_month_h;
  e_month_h;
  s_year;
  e_year;

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
  setSubTabVal( val: string) {
    this.subTabVal = val;
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

  showSubTab(val: string): boolean {
    if (val === this.subTabVal) {
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
    const resp = await this.db.fetchWallet(this.glb.agency_modify['id'], this.glb.user.id);
    if(resp['status'] === 'success'){
      if(resp['status'] === 'success'){
        this.wallet = resp['data'];
        let s_month:number, s_year:number, e_month:number, e_year:number, s_month_h:string, e_month_h:string;
         s_month= parseInt(this.wallet['next_pay'].split(' ')[0].split('-')[1]);
         s_year= parseInt(this.wallet['next_pay'].split(' ')[0].split('-')[0]);
        if (s_month === 12){
           e_month = 1;
           e_year = s_year + 1;
        } else {
           e_month = s_month + 1;
           e_year  = s_year;
        }
         s_month_h = this.util.monthConvertor(s_month);
         e_month_h = this.util.monthConvertor(e_month);
         this.s_month_h = s_month_h;
         this.s_year = s_year;
         this.e_month_h = e_month_h;
         this.e_year = e_year;
        } 
      }
    const resp_histo = await this.db.fetchHistoricalWallet(this.glb.agency_modify['id'],this.glb.user.id, resp['data']['id']);
    if(resp_histo['status'] === 'success'){
      this.historical_wallet = resp_histo['data'];
    }
    const resp_book = await this.db.fetchBookingAgency(this.glb.agency_modify['id'],this.glb.user.id);
    if(resp_book['status'] === 'success'){
      this.bookings = resp_book['data'];
      for (let i = 0; i< this.bookings.length; i++){
        switch (parseInt(this.bookings[i]['valid_paiement'])){
          case paiement_status.not_validated :
              this.bookings[i]['valid_paiement_h'] = 'paiment non validé';
            break;
          case paiement_status.not_yet_validated :
            this.bookings[i]['valid_paiement_h'] = 'paiement non encore validé'
            break;
          case paiement_status.refunded :
            this.bookings[i]['valid_paiement_h'] = 'paiement validé - comission annulation'
            break;
          case paiement_status.validated :
            this.bookings[i]['valid_paiement_h'] = 'paiement valide'
            break;
        }  
     }
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


  pay(item){
  }

  ngOnInit() {
  }



}
