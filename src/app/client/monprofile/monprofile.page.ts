import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';
import { LoadingService } from 'src/app/services/loading.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { AlertService } from '../../services/alert.service';
import { LoginService } from '../../services/login.service';
import { UserData } from '../../interfaces/user-data';
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
    payso: '0',
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
    userStatus: ''
  };

  

  constructor(
    public glb: GlobalsService ,
    private log: LoginService,
    private db: DbinteractionsService,
    private alertt: AlertService,
    private loading: LoadingService ) {
      this.usertmp = JSON.parse(JSON.stringify(this.glb.user));
      console.log(this.accparams);
      console.log(this.verified);
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
    this.loading.presentLoading();
    const res = await this.db.setAccParams(this.fromBoolToString(this.accparams));
    this.loading.dismissLoading();
    if (res) {
      this.alertt.presentAlert('Success!' , 'Updated successfully!');
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
      this.alertt.presentAlert('Error!' , 'Permis Id est requis!');
      return false;
    } else {
      if ( isNaN(Number(this.verifyAccData.lid)) ) {
        this.alertt.presentAlert('Error!' , 'Please enter a valid permis ID!');
        return false;
      } else {
        if ( this.verifyAccData.dateo === '' || this.verifyAccData.payso === '0') {
          this.alertt.presentAlert('Error!' , 'Date et Pays d\'obtention requis!');
          return false;
        } else {
          if (this.verifyAccData.rectoimg.get('file') === null || this.verifyAccData.versoimg.get('file') === null) {
            this.alertt.presentAlert('Error!' , 'Veuillez télécharger les deux faces de votre pièce d\'identité');
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
      this.loading.presentLoading();
      const recto = await this.db.uploadLicence(this.verifyAccData.rectoimg);
      if ( !recto ) {
        this.loading.dismissLoading();
        this.alertt.presentAlert('Error!' , 'Something Went wrong, Please try again later.');
      } else {
        const verso = await this.db.uploadLicence(this.verifyAccData.versoimg);
        if ( !verso ) {
          this.loading.dismissLoading();
          this.alertt.presentAlert('Error!' , 'Something Went wrong, Please try again later.');
        } else {
          const LiImgPaths = {
            rectoimg: recto['path'] ,
            versoimg: verso['path']
          };
          const result = await this.db.finishVerifyAcc(this.verifyAccData , LiImgPaths);
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
    if (this.glb.user.password !== this.usertmp.password) {
      something = await this.alertt.confirmPassword();
      this.loading.presentLoading();
      pass = await this.alertt.checkPass(something);
      this.loading.dismissLoading();
    }
    if (pass) {
      this.loading.presentLoading();
      if (this.proilePicFormData !== null ) {
        const response = await this.db.uploadProfilePic(this.proilePicFormData);
        if (response && response['success']) {
          this.proilePicFormData = null;
          this.glb.user.pic = this.glb.hostServer + response['path'];
          this.log.setLocalstorage('userpic' , this.glb.user.pic);
          console.log(this.glb.user.pic);
          await this.db.updateprofileinfos(this.usertmp);
        } else {
          this.alertt.presentAlert('Error!' , 'Something Went wrong, Please try again later.');
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
        this.loading.presentLoading();
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
        this.loading.presentLoading();
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
    this.loading.presentLoading();
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
    const res = await this.getAccParam();
    console.log(this.accparams);
  }

}
