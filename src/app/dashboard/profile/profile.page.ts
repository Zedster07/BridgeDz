import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';
import { LoadingService } from 'src/app/services/loading.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { AlertService } from '../../services/alert.service';
import { LoginService } from '../../services/login.service';
import { UtilService } from '../../services/util.service';
import { UserData } from '../../interfaces/user-data';
import { GeolocService } from '../../services/geoloc.service';
import { Router } from '@angular/router';
import { account_status } from 'src/app/interfaces/account_status';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  tabVal = 'edit';
  isAdmin = false;
  proilePicFormData: any = null;
  recto_temp = false;
  verso_temp = false;
  profilePicFormat: string;
  verified = this.glb.user.userStatus;
  emptyFormdata = new FormData();
  /*accparams: any = {
    demandlocation: [false , false , false],
    redemandlocation: [false , false , false],
    locAccept: [false , false , false],
    loccancel: [false , false , false],
    locrappel: [false , false , false],
    emailpromo: [false , false , false]
  };*/

  verifyAccData = {
    lid: '',
    dateo: '',
    datee: '0',
    rectoimg: this.emptyFormdata,
    versoimg: this.emptyFormdata
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
    dlicenceDateO: '',
    dlicenceDate: '',
    licenseRecot: '',
    licenseVerso: '',
    status_verified : ''
  };

  public agencytmp = {
    id:'',
    email: '',
    phoneNumber:'',
    username: '',
    pic: '',
    address: ''
  };

  updateKbis = {
    rectoimg: this.emptyFormdata,
    versoimg: this.emptyFormdata
  };

  searchResults = [];




  constructor(    public glb: GlobalsService ,
    private log: LoginService,
    private db: DbinteractionsService,
    private alertt: AlertService,
    private loading: LoadingService,
    private route: Router,
    public geoloc: GeolocService,
    private util: UtilService,
    private cdRef:ChangeDetectorRef) { 
    this.usertmp = JSON.parse(JSON.stringify(this.glb.user_modify));
    this.verifyAccData.dateo = this.glb.user_modify['dlicenceDate'];
    this.verifyAccData.lid = this.glb.user_modify['dlicenceID'];
    this.verifyAccData.datee = this.glb.user_modify['dlicenceDateO'];
    this.util.debug('constructor', this.glb.user_modify);
    //this.verifyAccData.rectoimg = this.glb.user_modify['dlicenceRecto'];
    //this.verifyAccData.versoimg = this.glb.user_modify['dlicenceVerso'];
    console.log(glb.user.phoneNumber);
    this.isAdmin = this.glb.ifAdmin(this.glb.user.role);
    if(this.isAdmin){ 
      this.tabVal = 'edit';
    } else { 
      this.tabVal = 'edit_agency';
    }
  }

  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }
  fromStrToBool(data: any) {
    let something = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        let arr = [];
        let i = 0;
        while (i < data[key].length) {
          if ( data[key][i] === '1' ) {
            arr.push(true);
          } else {
            arr.push(false);
          }
          i += 1;
        }
        something[key] = arr;
      }
    }
    return something;
  }

  fromBoolToString(data: any) {
    let something = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        let bits = '';
        data[key].forEach(element => {
          if (element) {
            bits += '1';
          } else {
            bits += '0';
          }
        });
        something[key] = bits;
      }
    }
    return something;
  }


  async accParamsUpdate() {
    console.log('first step');
    this.loading.presentLoading_generic('LOGIN.LOADING_WAIT'); //TODO
    const res = await this.db.setAccParams(this.fromBoolToString(this.glb.accparams));
    this.loading.dismissLoading();
    if (res) {
      this.alertt.presentAlert('POPUP.ACC_UPDATE_TITLE' , 'POPUP.ACC_UPDATE_MSG');
    }
  }

  changedDOB() {
    this.usertmp.dob = this.usertmp.dob.split('T')[0];
  }


  checkLicenceInfo(): boolean {
    if ( this.verifyAccData.lid === '') {
      this.alertt.presentAlert('POPUP.CHECK_LIC_MSG_1_TITLE' , 'POPUP.CHECK_LIC_MSG_1_MSG');
      return false;
    } else {
      if ( isNaN(Number(this.verifyAccData.lid)) ) {
        this.alertt.presentAlert('POPUP.CHECK_LIC_MSG_2_TITLE' , 'POPUP.CHECK_LIC_MSG_2_MSG');
        return false;
      } else {
        if ( this.verifyAccData.dateo === '' || this.verifyAccData.datee === '') {
          this.alertt.presentAlert('POPUP.CHECK_LIC_MSG_3_TITLE' , 'POPUP.CHECK_LIC_MSG_3_MSG');
          return false;
        } else {
          if (this.verifyAccData.rectoimg.get('file') === null || this.verifyAccData.versoimg.get('file') === null) {
            this.alertt.presentAlert('POPUP.CHECK_LIC_MSG_4_TITLE' , 'POPUP.CHECK_LIC_MSG_4_MSG');
            return false;
          }
        }
      }
    }
    return true;
  }

  async VerifyAccount() {
    this.verifyAccData.dateo = this.verifyAccData.dateo.split('T')[0];
    if (this.checkLicenceInfo()) {
      this.loading.presentLoading_generic('LOGIN.LOADING_WAIT'); //TODO
      const recto = await this.db.uploadLicence(this.verifyAccData.rectoimg);
      if ( !recto ) {
        this.loading.dismissLoading();
        this.alertt.presentAlert('POPUP.VERIFY_ACCOUNT_1_TITLE' , 'POPUP.VERIFY_ACCOUNT_1_MSG');
      } else {
        const verso = await this.db.uploadLicence(this.verifyAccData.versoimg);
        if ( !verso ) {
          this.loading.dismissLoading();
          this.alertt.presentAlert('POPUP.VERIFY_ACCOUNT_1_TITLE' , 'POPUP.VERIFY_ACCOUNT_1_MSG');
        } else {
          const LiImgPaths = {
            rectoimg: recto['path'] ,
            versoimg: verso['path']
          };
          this.util.debug('LiImgPaths', LiImgPaths);
          const result = await this.db.finishVerifyAcc(this.verifyAccData , LiImgPaths, this.glb.user_modify);
          if (result) {
            this.glb.user.userStatus = '1';
            this.verified = '1';
          }
          this.loading.dismissLoading();
        }
      }

    }
  }


 

  async UpdateProfile() {
    let something: any;
    let pass = true;
    if (this.glb.user.password !== this.usertmp.password && this.glb.ifAdmin(this.glb.user.role) === false ) {
      something = await this.alertt.confirmPassword();
      this.loading.presentLoading_generic('LOGIN.LOADING_WAIT'); //TODO
      pass = await this.alertt.checkPass(something);
      this.loading.dismissLoading();
    }
    if (pass || this.glb.ifAdmin(this.glb.user.role) === false) {
      this.loading.presentLoading_generic('LOGIN.LOADING_WAIT'); //TODO
      if (this.proilePicFormData !== null || this.glb.ifAdmin(this.glb.user.role) === false) {
        const response = await this.db.uploadProfilePic(this.proilePicFormData);
        if (response && response['success']) {
          this.proilePicFormData = null;
          this.glb.user.pic = this.glb.hostServer + response['path'];
          this.log.setLocalstorage('userpic' , this.glb.user.pic);
          console.log(this.glb.user.pic);
          await this.db.updateprofileinfos(this.usertmp);
        } else {
          this.alertt.presentAlert('POPUP.ERROR_TITLE' , 'POPUP.ERROR_MSG');
        }
      } else {
        await this.db.updateprofileinfos(this.usertmp);
      }
      this.loading.dismissLoading();
     // this.usertmp = JSON.parse(JSON.stringify(this.glb.user));
    } else {
      this.alertt.presentAlert('Error!' , 'Password incorrect !.');
    }
  }

  async UpdateAgncyInfo() {
    this.loading.presentLoading_generic('LOGIN.LOADING_WAIT'); //TODO
    if (this.proilePicFormData !== null) {
        const response = await this.db.uploadProfilePic(this.proilePicFormData);
        if (response && response['success']) {
          this.proilePicFormData = null;
          this.glb.AgencyLogData.data['picture'] = response['path'];
          console.log(this.glb.AgencyLogData.data['picture']);
          await this.db.updateAgencyinfos(this.glb.AgencyLogData);
          this.alertt.presentAlert('POPUP.PWD_UPDATE_PROFIL_TITLE' , 'POPUP.PWD_UPDATE_PROFIL_MSG');
        } else {
          this.alertt.presentAlert('POPUP.ERROR_TITLE' , 'POPUP.ERROR_MSG');
        }
      } else {    
        await this.db.updateAgencyinfos(this.glb.AgencyLogData);
        this.alertt.presentAlert('POPUP.PWD_UPDATE_PROFIL_TITLE' , 'POPUP.PWD_UPDATE_PROFIL_MSG');
      }
      this.loading.dismissLoading();
  }

  async updateKbisInfo() {

    this.loading.presentLoading_generic('LOGIN.LOADING_WAIT'); //TODO
    const recto = await this.db.uploadLicence(this.updateKbis.rectoimg);
    if ( !recto ) {
      this.loading.dismissLoading();
      this.alertt.presentAlert('POPUP.VERIFY_ACCOUNT_1_TITLE' , 'POPUP.VERIFY_ACCOUNT_1_MSG');
    } else {
      const verso = await this.db.uploadLicence(this.updateKbis.versoimg);
      if ( !verso ) {
        this.loading.dismissLoading();
        this.alertt.presentAlert('POPUP.KBIS_UPDATE_PROFIL_TITLE' , 'POPUP.KBIS_UPDATE_PROFIL_MSG');
      } else {
        const LiImgPaths = {
          rectoimg: recto['path'] ,
          versoimg: verso['path']
        };
        this.util.debug('LiImgPaths',LiImgPaths);
        const result = await this.db.updateKbisInfo(LiImgPaths);
        if (result.status === 'success')  {
          this.glb.kbis_modify = result.data;
          this.glb.AgencyLogData.status = account_status.review;
          this.alertt.presentAlert('POPUP.KBIS_UPDATE_PROFIL_TITLE' , 'POPUP.KBIS_UPDATE_PROFIL_MSG');
        }
        this.loading.dismissLoading();
      }
    }

}

async updateRibInfo() {
  this.loading.presentLoading_generic('LOGIN.LOADING_WAIT'); //TODO
  this.glb.rib_modify['pay_choice'] = this.util.getRaidoButtonChoice("pay");
  this.util.debug('updateRibInfo', this.glb.rib_modify )
  const res = await this.db.updateRibInfo();
  this.loading.dismissLoading();
  if (res.message === 'Success'){  
    this.glb.rib_modify =  res.data;
    this.alertt.presentAlert('POPUP.RIB_UPDATE_PROFIL_TITLE' , 'POPUP.RIB_UPDATE_PROFIL_MSG');
  }
}


  changepic2(imghandler: string , filehandler: string, idx: string) {
    const elem = document.getElementById(filehandler);
    elem.click();
    this.util.debug('dlicenceVerso', this.glb.user_modify['dlicenceVerso']);
    //this.recto_temp = true;
    /*if(filehandler !== 'rectoid')
    {
       this.verso_temp = true;
    } */
    elem.onchange = () => {
      const file = (<HTMLInputElement>document.getElementById(filehandler)).files[0];
      let preview = document.getElementById(imghandler) as HTMLImageElement;

      const reader  = new FileReader();
      reader.onloadstart = () => {
        this.loading.presentLoading_generic('LOGIN.LOADING_WAIT'); //TODO
      };
      reader.onload = () => {
        const formdata = new FormData();
        formdata.append('file' , file);
        preview.src = reader.result as string;
        if (filehandler === 'rectoid') {
          this.verifyAccData.rectoimg = formdata;
          this.util.debug('formdata-rectoimg', formdata);
        } else {
          this.verifyAccData.versoimg = formdata;
          this.util.debug('formdata-versoimg', formdata);
        }
        
        if (filehandler === 'rectoid_K') {
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



  changepic(idx, idx_img, agency) {
    const elem = document.getElementById(idx);
    console.log(elem);
    elem.click();
    elem.onchange = () => {
      const file = (<HTMLInputElement>document.getElementById(idx)).files[0];
      const preview = document.getElementById(idx_img) as HTMLImageElement;
      const reader  = new FileReader();

      reader.onloadstart = () => {
        this.loading.presentLoading_generic('LOGIN.LOADING_WAIT'); //TODO
      };

      reader.onload = () => {
        const formdata = new FormData();
        formdata.append('file' , file);
        this.util.debug('file', file);
        preview.src = reader.result as string;  
        if (agency === 0){
          this.usertmp.pic = reader.result as string;
        } else {
          //this.glb.AgencyLogData.data['picture'] = reader.result as string;
        } 
        this.proilePicFormData = formdata;
        this.util.debug('formdata', formdata);
        this.util.debug('proilePicFormData', this.proilePicFormData);
      };

      reader.onloadend = () => {
        this.loading.dismissLoading();
      };

     // this.profilePicFormat = file.name.split('.').pop().toLowerCase();
      console.log(this.proilePicFormData);
    
      reader.readAsDataURL(file);
    };
  }


  setTabVal( val: string) {
    this.tabVal = val;
  }
  showTab(val: string): boolean {
    if (val === this.tabVal) {
      return true;
    }
    return false;
  }
  async getAccParam() {
    this.loading.presentLoading_generic('LOGIN.LOADING_WAIT'); //TODO
    const data = await this.db.getAccParams();
    this.loading.dismissLoading();
    if (data) {
      return this.fromStrToBool(data);
    } else {
      return {
        demandlocation: [false , false , false],
        redemandlocation: [false , false , false],
        locAccept: [false , false , false],
        loccancel: [false , false , false],
        locrappel: [false , false , false],
        emailpromo: [false , false , false]
      };
    }
  }
  async ngOnInit() {
    //const res = await this.getAccParam();
  
    /*if (this.glb.kbis_modify.length === 0){
      const resp = await this.db.fetchKbis(this.glb.AgencyLogData.id);
      const resp_rib = await this.db.fetchRib(this.glb.AgencyLogData.id);
      if (resp['status'] === 'success'){
        this.glb.kbis_modify = resp['data'];
        this.util.debug('ngOnInt kbis', this.glb.kbis_modify);
      } 
      if (resp_rib['status'] === 'success'){
        this.glb.rib_modify = resp_rib['data'];
        this.util.debug('ngOnInt rib', this.glb.kbis_modify);
      } 

    } */
    //console.log(this.glb.accparams);
  }

  async modifyCancel(index) {    
    this.route.navigate(['dashboard','duser']);
}

addressLookup(address: string) {
  console.log('addressLookup');
  if (address.length > 3) {
    this.geoloc.addressLookup(address, '', 4).subscribe(results => {
      this.searchResults = results;
    });
  } else {
    this.searchResults = [];
  }
  console.log(this.searchResults);
}

updateSearch() {
  console.log(this.usertmp.address);
  if (this.glb.AgencyLogData.data['address']  == '') {
    this.searchResults  = [];
   return;
  }
  this.addressLookup(this.glb.AgencyLogData.data['address']);
  if (this.searchResults != undefined && this.searchResults.length != 0){
     console.log(this.searchResults[0]['display_name']);
  }
  
}


chooseItem(item: any) {
  this.glb.AgencyLogData.data['address'] = item['display_name'];
  console.log(item);
  this.searchResults = [];
}

 



}
