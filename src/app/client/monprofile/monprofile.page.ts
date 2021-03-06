import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';
import { LoadingService } from 'src/app/services/loading.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { AlertService } from '../../services/alert.service';
import { UtilService } from '../../services/util.service';
import { GeolocService } from '../../services/geoloc.service';
import { LoginService } from '../../services/login.service';
import { UserData } from '../../interfaces/user-data';
import { account_status } from 'src/app/interfaces/account_status';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-monprofile',
  templateUrl: './monprofile.page.html',
  styleUrls: ['./monprofile.page.scss'],
})
export class MonprofilePage implements OnInit {



  tabVal = 'edit';
  proilePicFormData: any = null;
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



  verifyAccData = {
    lid: '',
    dateo: '',
    datee: '0',
    rectoimg: this.emptyFormdata,
    versoimg: this.emptyFormdata
  };

  password : '';
  new_password: '';
  password_confirm: '';
  searchResults = [];
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
    status_verified: ''
  };

  

  constructor(
    public glb: GlobalsService ,
    private log: LoginService,
    private db: DbinteractionsService,
    private alertt: AlertService,
    translate: TranslateService,
    private loading: LoadingService,
    public geoloc: GeolocService,
    public util: UtilService ) {
    this.usertmp = JSON.parse(JSON.stringify(this.glb.user));
    this.verifyAccData.lid = this.glb.user.licenseId;
    this.verifyAccData.dateo = this.glb.user.dlicenceDate;
    this.verifyAccData.datee = this.glb.user.dlicenceDateO;


    console.log(this.glb.user);
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
    if (this.usertmp.address  == '') {
      this.searchResults  = [];
     return;
    }
    this.addressLookup(this.usertmp.address);
    if (this.searchResults != undefined && this.searchResults.length != 0){
       console.log(this.searchResults[0]['display_name']);
    }
    
  }


  chooseItem(item: any) {
    this.usertmp.address = item['display_name'];
    console.log(item);
    this.searchResults = [];
  }

  async accParamsUpdate() {
    this.glb.toReload  = 0;
    this.loading.presentLoading_generic('LOGIN.LOADING_WAIT'); // TODO
    const res = await this.db.setAccParams(this.fromBoolToString(this.glb.accparams));
    this.loading.dismissLoading();
    if (res) {
      this.alertt.presentAlert('POPUP.ACC_UPDATE_TITLE' , 'POPUP.ACC_UPDATE_MSG');
    }
  }

  changedDOB() {
    this.usertmp.dob = this.usertmp.dob.split('T')[0];
  }


  setTabVal( val: string) {
    this.tabVal = val;
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
      this.loading.presentLoading_generic('LOGIN.LOADING_WAIT'); // TODO
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
          console.log(this.verifyAccData);
          const result = await this.db.finishVerifyAcc(this.verifyAccData , LiImgPaths, this.glb.user);
          console.log(result);
          if (result['status'] === 'success') {
            this.glb.user.licenseId = this.verifyAccData.lid;
            this.glb.user.dlicenceDate = this.verifyAccData.dateo;
            this.glb.user.dlicenceDateO = this.verifyAccData.datee;
            this.glb.user.licenseRecot = LiImgPaths.rectoimg;
            this.glb.user.licenseVerso = LiImgPaths.rectoimg;
            this.glb.user.status_verified = (account_status.review).toString();
            this.alertt.presentAlert('POPUP.VERIFY_ACC_TITLE' , 'POPUP.VERIFY_ACC_MSG');
          }
          this.loading.dismissLoading();
        }
      }

    }
  }

  async updatePassword(){
    let pass = await this.alertt.checkPass(this.password);
    if((pass) && this.new_password === this.password_confirm && (this.glb.correctPassword(this.password_confirm) === 2)){
        let change = await this.db.updatePassword(this.new_password, this.usertmp.id);
        this.password ='';
        this.password_confirm ='';
        this.new_password ='';
        this.alertt.presentAlert('POPUP.PWD_UPDATE_TITLE' , 'POPUP.PWD_UPDATE_MSG');
    } else if (!pass){
      this.alertt.presentAlert('POPUP.PWD_UPDATE_1_TITLE' , 'POPUP.PWD_UPDATE_1_MSG');
    } else if (this.new_password !== this.password_confirm) {
      this.alertt.presentAlert('POPUP.PWD_UPDATE_2_TITLE' , 'POPUP.PWD_UPDATE_ERROR_MSG');
    } else if (this.new_password.length !== 2){
      this.alertt.presentAlert('POPUP.PWD_UPDATE_2_TITLE' , 'POPUP.PWD_FORMAT_NOT_CORRECT');
    }
  }
  async UpdateProfile() {
    let something: any;
    let pass = true;
    /*if (this.glb.user.password !== this.usertmp.password) {
      something = await this.alertt.confirmPassword();
      this.loading.presentLoading();
      pass = await this.alertt.checkPass(something);
      this.loading.dismissLoading();
    }*/
    if (pass) {
      this.loading.presentLoading_generic('LOGIN.LOADING_WAIT'); // TODO
      if (this.proilePicFormData !== null ) {
        const response = await this.db.uploadProfilePic(this.proilePicFormData);
        if (response && response['success']) {
          this.proilePicFormData = null;
          this.glb.user.pic = response['path'];
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
      this.usertmp = JSON.parse(JSON.stringify(this.glb.user));
    } else {
      this.alertt.presentAlert('Error!' , 'Password incorrect !.');
    }
  }

  showTab(val: string): boolean {
    if (val === this.tabVal) {
      return true;
    }
    return false;
  }
  changepic2(imghandler: string , filehandler: string) {
    const elem = document.getElementById(filehandler);
    elem.click();
    elem.onchange = () => {
      const file = (<HTMLInputElement>document.getElementById(filehandler)).files[0];
      const preview = document.getElementById(imghandler) as HTMLImageElement;
      const reader  = new FileReader();
      reader.onloadstart = () => {
        this.loading.presentLoading_generic('LOADING_WAIT'); // TODO
      };
      reader.onload = () => {
        const formdata = new FormData();
        formdata.append('file' , file);
        preview.src = reader.result as string;
        if (filehandler === 'rectoid') {
          this.verifyAccData.rectoimg = formdata;
        } else {
          this.verifyAccData.versoimg = formdata;
        }
      };
      reader.onloadend = () => {
        this.loading.dismissLoading();
      };
      reader.readAsDataURL(file);
    };
  }
  changepic() {
    const elem = document.getElementById('changepichandler');
    elem.click();
    elem.onchange = () => {
      const file = (<HTMLInputElement>document.getElementById('changepichandler')).files[0];
      const preview = document.getElementById('changeprofilepic') as HTMLImageElement;
      const reader  = new FileReader();

      reader.onloadstart = () => {
        this.loading.presentLoading_generic('LOGIN.LOADING_WAIT'); //TODO
      };

      reader.onload = () => {
        const formdata = new FormData();
        formdata.append('file' , file);
        preview.src = reader.result as string;
        this.usertmp.pic = reader.result as string;
        this.proilePicFormData = formdata;
      };

      reader.onloadend = () => {
        this.loading.dismissLoading();
      };

      this.profilePicFormat = file.name.split('.').pop().toLowerCase();
      reader.readAsDataURL(file);
    };
  }

  changepicUrl() {

  }


  async getAccParam() {
    this.loading.presentLoading_generic('LOGIN.LOADING_WAIT'); //TODO
    const data = await this.db.getAccParams();
    console.log(data);
    this.loading.dismissLoading();
    if (data.status = 'success') {
      return this.fromStrToBool(data.data);
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
    if (this.glb.toReload === 0){
      this.util.debug('ngOnInit , monprofil', this.glb.accparams);
      const data = await this.db.getAccParams();
      await this.util.getAccParam_1(this.glb.accparams, data);
    }
  }

}
