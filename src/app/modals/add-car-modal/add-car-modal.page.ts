import { Component, OnInit , ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { NavParams , ModalController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';
import { HttpEventType , HttpRequest , HttpClient, HttpEvent} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { GlobalsService } from 'src/app/services/globals.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
@Component({
  selector: 'app-add-car-modal',
  templateUrl: './add-car-modal.page.html',
  styleUrls: ['./add-car-modal.page.scss'],
})
export class AddCarModalPage implements OnInit {
  public uploadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public downloadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  @ViewChild('AddCarForm' , {static: true}) AddCarForm: IonSlides;

  sliderOne: any;
  selectedMarque = '';
  Marks = [
    {
      marque: 'Volkswagen' ,
      value: 'volkswagen'
    },
    {
      marque: 'Renault' ,
      value: 'renault'
    }
  ];
  Models = {
    0: [],
    volkswagen: [
      {model: 'Golf' , value: 'golf'},
      {model: 'Polo' , value: 'polo'}
    ],
    renault: [
      {model: 'Clio', value: 'clio'},
      {model: 'Symbol', value: 'symbol'}
    ]
  };
  steps = 0;
  currentStep = 1;
  formData = [
    {
      marque: [ '0' , 'marque' ],
      model: ['0' , 'modele']
    },
    {
      carburant: ['0' , 'carburant'],
      boitevitesse: 'manuelle'
    },
    {
      clim: false,
      regvit: false,
      gps: false,
      siegebb: false,
      leCD: false,
      needConf: false
    },
    {
      address: ['' , 'adresserdv']
    },
    {
      prix: ['' , 'price']
    },
    {
      avant : null as FormData,
      arriere : null as FormData,
      cote1 : null as FormData,
      cote2 : null as FormData,
      inside : null as FormData,
      picsMeta: {
        avant : [false , false, 0, ''],
        arriere : [false , false, 0, ''],
        cote1 : [false , false, 0, ''],
        cote2 : [false , false, 0, ''],
        inside : [false , false, 0, ''],
      }
    }
  ];

  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
  };

  constructor(
    public modalCtrl: ModalController,
    private glb: GlobalsService,
    private loading: LoadingService,
    private db: DbinteractionsService,
    private http: HttpClient) {}

  Number(x) {
    return Number(x);
  }

  uploadPic(val: string) {
    const elem = document.getElementById(val + 'file');
    elem.click();
    elem.onchange = () => {
      this.formData[5].picsMeta[val][0] = false;
      const file = (<HTMLInputElement>document.getElementById(val + 'file')).files[0];
      const preview = document.getElementById(val + 'preview') as HTMLImageElement;
      const reader  = new FileReader();

      reader.onloadstart = () => {
        // this.loading.presentLoading();
      };

      reader.onload = () => {
        const formdata = new FormData();
        formdata.append('file' , file); formdata.append('picside' , val); formdata.append('id' , this.glb.user.id);
        preview.src = reader.result as string;
        const req = new HttpRequest('POST', this.glb.hostServer + 'carsupload.php' , formdata , {
          reportProgress: true
        });

        const some = this.http.request(req).subscribe((event: HttpEvent<any>) => {
          let status;
          console.log(event);
          switch (event.type) {
            case HttpEventType.Sent:
              console.log(`Uploading Files`);
              this.formData[5].picsMeta[val][0] = true;
              break;
            case HttpEventType.UploadProgress:
              status = Math.round(event.loaded / event.total);
              this.formData[5].picsMeta[val][2] = status;
              console.log(`Files are ${status}% uploaded`);
              break;
            case HttpEventType.DownloadProgress:
              status = Math.round(100 * event.loaded / event.total);
              this.downloadProgress.next(status); 
              console.log(`Files are ${status}% downloaded`);
              break;
            case HttpEventType.Response:
              this.formData[5].picsMeta[val][1] = true;
              this.formData[5].picsMeta[val][3] = event.body['path'];
              this.formData[5].picsMeta[val][2] = 1;
              console.log( `Done` );
              break;
            default:
              // console.log( `Something went wrong` );
          }
        }, err => {
          console.error(err);
        });
        switch (val) {
          case 'avant':
            this.formData[5].avant = formdata;
            break;
          case 'arriere':
            this.formData[5].arriere = formdata;
            break;
          case 'cote1':
            this.formData[5].cote1 = formdata;
            break;
          case 'cote2':
            this.formData[5].cote2 = formdata;
            break;
          case 'inside':
            this.formData[5].inside = formdata;
            break;
          default:
            break;
        }
      };
      reader.onloadend = () => {
        // this.loading.dismissLoading();
      };
      reader.readAsDataURL(file);
    };
  }


  chosenMarqueID(ev) {
    this.formData[0].model[0] = '0';
  }
  checkStep(step) {
    console.log(this.formData);
    switch (step) {
      case 1:
        const marqueerror = document.getElementById(this.formData[0].marque[1]);
        const modeleerror = document.getElementById(this.formData[0].model[1]);
        if ( this.formData[0].marque[0] === '0' ) {
          marqueerror.style.border = '1px solid red';
          return false;
        } else {
          marqueerror.style.border = '1px solid green';
          if ( this.formData[0].model[0] === '0' ) {
            modeleerror.style.border = '1px solid red';
            return false;
          } else {
            modeleerror.style.border = '1px solid green';
            return true;
          }
        }
      case 2:
        const carburanterror = document.getElementById(this.formData[1].carburant[1]);
        if (this.formData[1].carburant[0] === '0') {
          carburanterror.style.border = '1px solid red';
          return false;
        } else {
          carburanterror.style.border = '1px solid green';
          return true;
        }
      case 4:
        const addresserror = document.getElementById(this.formData[3].address[1]);
        if (this.formData[3].address[0] === '') {
          addresserror.style.border = '1px solid red';
          return false;
        } else {
          addresserror.style.border = '1px solid green';
          return true;
        }
      case 5:
        const prixerror = document.getElementById(this.formData[4].prix[1]);
        if (Number(this.formData[4].prix[0]) <= 0 ) {
          prixerror.style.border = '1px solid red';
          return false;
        } else {
          prixerror.style.border = '1px solid green';
          return true;
        }
      case 6:
        const pics = ['avant' , 'arriere' , 'cote1' , 'cote2' , 'inside'];
        let i = 0;
        let count = 0;
        for (const key in this.formData[5]) {
          if (this.formData[5].hasOwnProperty(key)) {
            const picError = document.getElementById(pics[i] + 'item');
            console.log(key);
            console.log(this.formData[5]['picsMeta']);
            console.log(this.formData[5]);
            if (key !== 'picsMeta') {
              if (this.formData[5][key] === null || !this.formData[5]['picsMeta'][key][1]) {
                picError.style.color = 'red';
              } else {
                picError.style.color = 'green';
                count += 1;
              }
            }
            i += 1;
          }
        }

        if ( count === 5 ) {
          return true;
        }
        return false;

      default:
        break;
    }
    return true;
  }

  close() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }
  generateCarPicsList() {
    let picsList = '';
    let i = 0;
    for (const key in this.formData[5].picsMeta) {
      if (this.formData[5].picsMeta.hasOwnProperty(key)) {
        if (this.formData[5].picsMeta[key][0] === true) {
          if (i > 0) {
            picsList += ',';
          }
          picsList += this.formData[5].picsMeta[key][3];
        }
        i += 1;
      }
    }
    return picsList;
  }
  
  generateOptionsList() {
    let list = ''; let i = 0;
    for (const key in this.formData[2]) {
      if (this.formData[2].hasOwnProperty(key)) {
        if (i !== 0) {
          list += ',';
        }
        if (this.formData[2][key] === true) {
          list += '1';
        } else {
          list += '0';
        }
        i += 1;
      }
    }
    return list;
  }

  async confirmAddCar() {
    this.loading.presentLoading();
    const formdata = new FormData();
    const picsList = this.generateCarPicsList();
    const optionsList = this.generateOptionsList();
    formdata.append('marque' , this.formData[0].marque[0]); formdata.append('piclist' , picsList);
    formdata.append('id' , this.glb.AgencyLogData.id);
    formdata.append('model' , this.formData[0].model[0]);
    formdata.append('engine' , this.formData[1].carburant[0]);
    formdata.append('vitesse' , this.formData[1].boitevitesse);
    formdata.append('options' , optionsList);
    formdata.append('address' , this.formData[3].address[0]);
    formdata.append('prix' , this.formData[4].prix[0]);
    formdata.append('needConfirmation' , this.formData[2].needConf + '');
    formdata.append('request' , 'addCar');
    const req = new HttpRequest('POST', this.glb.hostServer + 'core.php' , formdata , {
      reportProgress: true
    });
    const some = this.http.request(req).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Response:
          this.loading.dismissLoading();
          this.finalize();
          break;
        default:
      }
    }, err => {
      this.loading.dismissLoading();
      console.log(err);
    });
  }
  async finalize() {
    const id = this.db.getStorage('accID');
    const res = await this.db.fetchCars(id);
    if (res && res.status !== 'failure') {
      this.glb.myCars = res.data;
      this.closeModal();
    }
  }
  public closeModal() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }
  slideNext(slideView) {
    if (this.checkStep(this.currentStep)) {
      this.AddCarForm.lockSwipes(false);
      this.steps = (this.steps + 0.2) > 1 ? 1 : this.steps + 0.2;
      slideView.slideNext(500);
      this.AddCarForm.lockSwipes(true);
      this.currentStep += 1;
      if (this.currentStep === 7) {
        this.confirmAddCar();
      }
    }
  }

  slidePrev(slideView) {
    this.currentStep -= 1;
    this.AddCarForm.lockSwipes(false);
    this.steps = (this.steps - 0.2) < 0  ? 0 : this.steps - 0.2;
    slideView.slidePrev(500);
    this.AddCarForm.lockSwipes(true);
  }


  ngOnInit() {
    this.AddCarForm.lockSwipes(true);
  }

}
