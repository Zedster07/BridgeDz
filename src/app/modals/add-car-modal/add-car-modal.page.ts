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
      marque: 'Peugeot' ,
      value: 'peugeot'
    },
    {
      marque: 'Renault' ,
      value: 'renault'
    },
    {
      marque: 'Daçia' ,
      value: 'dacia'
    },
    {
      marque: 'Citroën' ,
      value: 'citroën'
    },
    {
      marque: 'Volkswagen' ,
      value: 'volkswagen'
    },
    {
      marque: 'Seat' ,
      value: 'seat'
    },
    {
      marque: 'Opel' ,
      value: 'opel'
    },
    {
      marque: 'Skoda' ,
      value: 'skoda'
    },
    {
      marque: 'Nissan' ,
      value: 'nissan'
    },
    {
      marque: 'Toyota' ,
      value: 'toyota'
    },
    {
      marque: 'Hyundai' ,
      value: 'hyundai'
    },
    {
      marque: 'KIA' ,
      value: 'Kia'
    },
    {
      marque: 'Renault' ,
      value: 'renault'
    },
    {
      marque: 'Audi' ,
      value: 'audi'
    },
    {
      marque: 'BMW' ,
      value: 'bmw'
    },
    {
      marque: 'Mercedes' ,
      value: 'mercedes'
    },
    {
      marque: 'Fiat' ,
      value: 'fiat'
    },
    {
      marque: 'DS' ,
      value: 'ds'
    },
    {
      marque: 'Ford' ,
      value: 'ford'
    },
    {
      marque: 'Infiniti' ,
      value: 'infiniti'
    },
    {
      marque: 'Luxus' ,
      value: 'luxus'
    },
    {
      marque: 'Land Rovor' ,
      value: 'land_Rovor'
    },
    {
      marque: 'Volvo' ,
      value: 'volvo'
    },
    {
      marque: 'Alfa Romeo ' ,
      value: 'alfa_Romeo '
    },
    {
      marque: 'Jeep' ,
      value: 'jeep'
    },
    {
      marque: 'Mitsubishi' ,
      value: 'mitsubishi'
    }
  ];
  Models = {
    0: [],
    volkswagen: [
      {model: 'Golf' , value: 'golf'},
      {model: 'Polo' , value: 'polo'},
      {model: 'Passat' , value: 'passat'},
      {model: 'Tiguan' , value: 'tiguan'},
      {model: 'T-ROC' , value: 't-roc'},
      {model: 'T-CROSS' , value: 't-cross'},
      {model: 'Touareg' , value: 'touareg'},
      {model: 'Caddy' , value: 'caddy'},
      {model: 'Passat sw' , value: 'passat_sw'},
      {model: 'Fox' , value: 'fox'}
    ],
    renault: [
      {model: 'Clio' , value: 'clio'},
      {model: 'Kango' , value: 'kango'},
      {model: 'Megane' , value: 'megane'},
      {model: 'Talsiman' , value: 'talsiman'},
      {model: 'Lagauna' , value: 'lagauna'},
      {model: 'Capture' , value: 'capture'},
      {model: 'Kadjar' , value: 'kadjar'},
      {model: 'Koleos' , value: 'koleos'},
      {model: 'Twingo' , value: 'twingo'},
      {model: 'Trafic' , value: 'trafic'}
    ],
    peugeot: [
      {model: '208' , value: '208'},
      {model: '207' , value: '207'},
      {model: '2008' , value: '2008'},
      {model: '308' , value: '308'},
      {model: '3008' , value: '3008'},
      {model: '307' , value: '307'},
      {model: '508' , value: '508'},
      {model: '407' , value: '407'},
      {model: '5008' , value: '5008'},
      {model: '4008' , value: '4008'},
      {model: '206' , value: '206'},
      {model: '108' , value: '108'},
      {model: 'Partner' , value: 'partner'},
    ],
    dacia: [
      {model: 'Logan' , value: 'logan'},
      {model: 'Sandero' , value: 'sandero'},
      {model: 'Duster' , value: 'duster'},
      {model: 'Dokker' , value: 'dokker'},
      {model: 'Lodgy' , value: 'lodgy'},
    ],
    citroën: [
      {model: 'C3' , value: 'C3'},
      {model: 'C4' , value: 'C4'},
      {model: 'C4 Cactus' , value: 'c4_cactus'},
      {model: 'C4 Picasso' , value: 'c4_picasso'},
      {model: 'C5' , value: 'C5'},
      {model: 'C5 crossback,' , value: 'c5_crossback,'},
      {model: 'Berlingo' , value: 'berlingo'},
      {model: 'Spacetourer' , value: 'spacetourer'},
      {model: 'C1' , value: 'C1'},
    ],
    mitsubishi: [
      {model: 'ASX' , value: 'asx'},
      {model: 'Eclipse Cross' , value: 'eclipse_cross'},
      {model: 'Space Star,' , value: 'space_star,'},
      {model: 'Outlander HPEV' , value: 'outlander hpev'},
    ],
    mercedes: [
      {model: 'Class A' , value: 'a'},
      {model: 'Class B' , value: 'b'},
      {model: 'Class C' , value: 'c'},
      {model: 'class E' , value: 'e'},
      {model: 'class S' , value: 's'},
      {model: 'CLA' , value: 'cla'},
      {model: 'SLA' , value: 'SLA'},
      {model: 'GLK' , value: 'glk'},
      {model: 'GLC' , value: 'glc'},
      {model: 'GLC Coupé' , value: 'glc_coupé'},
      {model: 'GLE' , value: 'gle'},
      {model: 'GLE coupé' , value: 'gle_coupé'},
      {model: 'GLS' , value: 'GLS'}
    ],
    jeep: [
      {model: 'Compass' , value: 'compass'},
      {model: 'Cherroke' , value: 'cherroke'},
      {model: 'Wrangler' , value: 'wrangler'},
      {model: 'Wrangler limited' , value: 'wrangler_limited'},
      {model: 'Renegade' , value: 'renegade'}
    ],
    nissan: [
      {model: 'Micra' , value: 'micra'},
      {model: 'Juke' , value: 'juke'},
      {model: 'Qashkai Leaf' , value: 'qashkai_leaf'},
      {model: 'Qashkai ' , value: 'qashkai Leaf'},
      {model: 'X-Trail' , value: 'x-trail'},
      {model: 'Navara' , value: 'navara'}
    ],
    toyota: [
      {model: 'Yaris' , value: 'yaris'},
      {model: 'Corolla' , value: 'corolla'},
      {model: 'Auris' , value: 'auris'},
      {model: 'Camry' , value: 'camry'},
      {model: 'RAV4' , value: 'rav4'},
      {model: 'Landcruiser' , value: 'landcruiser'},
      {model: 'Prius' , value: 'prius'}
    ],
    audi: [
      {model: 'A1' , value: 'A1'},
      {model: 'A3' , value: 'A3'},
      {model: 'S3' , value: 'S3'},
      {model: 'Q2' , value: 'Q2'},
      {model: 'Q3' , value: 'Q3'},
      {model: 'A4' , value: 'A4'},
      {model: 'S4' , value: 'S4'},
      {model: 'A5' , value: 'A5'},
      {model: 'Q5' , value: 'Q5'},
      {model: 'A6' , value: 'A6'},
      {model: 'A7' , value: 'A7'},
      {model: 'Q7' , value: 'Q7'},
      {model: 'Q8' , value: 'Q8'}
    ],
    alfa_Romeo: [
      {model: 'Mito' , value: 'mito'},
      {model: 'Guilietta' , value: 'guilietta'},
      {model: 'Guilia' , value: 'guilia'},
      {model: 'Stelvio' , value: 'stelvio'},
    ],
    land_Rovor: [
      {model: 'Ronge Rover' , value: 'ronge_rover'},
      {model: 'Ronge Rover sport' , value: 'ronge_rover_sport'},
      {model: 'Ronge Rover Valer' , value: 'ronge_rover_valer'},
      {model: 'Defender' , value: 'defender'},
      {model: 'Discovery' , value: 'discovery'},
      {model: 'Discovery sport' , value: 'discovery_sport'},
      {model: 'Evoque' , value: 'evoque'},
    ],
    fiat: [
      {model: 'Typo' , value: 'typo'},
      {model: 'Punto' , value: 'punto'},
      {model: 'Panda' , value: 'panda'},
      {model: '500' , value: '500'},
      {model: '500 X' , value: '500_x'}
    ],
    bmw: [
      {model: 'S1' , value: 'S1'},
      {model: 'X1' , value: 'X1'},
      {model: 'X2' , value: 'X2'},
      {model: 'S3' , value: 'S3'},
      {model: 'X3' , value: 'X3'},
      {model: 'X4' , value: 'X4'},
      {model: 'S5' , value: 'S5'},
      {model: 'X5' , value: 'X5'},
      {model: 'X6' , value: 'X6'},
      {model: 'X7' , value: 'X7'},
      {model: 'S7' , value: 'S7'}
    ],
    luxus: [
      {model: 'IS' , value: 'is'},
      {model: 'RX' , value: 'rx'},
      {model: 'LS' , value: 'ls'},
      {model: 'ES' , value: 'es'},
      {model: 'NX' , value: 'nx'},
      {model: 'CT' , value: 'ct'},
      {model: 'LC' , value: 'lc'},
      {model: 'UX' , value: 'ux'},
      {model: 'RC' , value: 'rc'},
    ],
    infiniti: [
      {model: 'Q30' , value: 'Q30'},
      {model: 'QX30' , value: 'QX30'},
      {model: 'Q50' , value: 'Q50'},
      {model: 'Q70' , value: 'Q70'},
    ],
    kia: [
      {model: 'Picanto' , value: 'picanto'},
      {model: 'Rio' , value: 'rio'},
      {model: 'Sportage' , value: 'sportage'},
      {model: 'Seed' , value: 'seed'},
      {model: 'Stonic' , value: 'stonic'},
      {model: 'Nero' , value: 'Nero'},
      {model: 'XSeed' , value: 'xseed'},
      {model: 'ProSeed' , value: 'proSeed'},
      {model: 'Stinger' , value: 'stinger'},
    ],
    skoda: [
      {model: 'Fabia' , value: 'fabia'},
      {model: 'Octavia' , value: 'octavia'},
      {model: 'Superb' , value: 'superb'},
      {model: 'Kodiaq' , value: 'kodiaq'},
      {model: 'Citigo' , value: 'citigo'},
      {model: 'Karoq' , value: 'karoq'},
      {model: 'Scala' , value: 'scala'},
      {model: 'Kamiq' , value: 'kamiq'}
    ],
    seat: [
      {model: 'Ibiza' , value: 'ibiza'},
      {model: 'Leon' , value: 'leon'},
      {model: 'Toledo' , value: 'toledo'},
      {model: 'Alhembra' , value: 'alhembra'},
      {model: 'Ateca' , value: 'ateca'},
      {model: 'Arona' , value: 'arona'},
      {model: 'Tarraco' , value: 'tarraco'},
      {model: 'SportTourer' , value: 'sportTourer'},
      {model: 'Golf' , value: 'golf'},
      {model: 'Polo' , value: 'polo'}     
    ],
    opel: [
      {model: 'Corsa' , value: 'corsa'},
      {model: 'Astra' , value: 'astra'},
      {model: 'Crossland' , value: 'crossland'},
      {model: 'Grandland' , value: 'grandland'},
      {model: 'Antara' , value: 'antara'},
      {model: 'Zafira' , value: 'zafira'},
      {model: 'Combo Life' , value: 'combo_life'},
      {model: 'Insigina' , value: 'insigina'},
    ],
    ds: [
      {model: 'DS3' , value: 'ds3'},
      {model: 'DS3 Crossback' , value: 'ds3_crossback'},
      {model: 'DS5' , value: 'ds5'},
      {model: 'DS5 Crossback' , value: 'ds5_rossback'},
      {model: 'DS7' , value: 'DS7'},
      {model: 'DS7 Crossback' , value: 'ds7_crossback'},
    ],
    hyundai: [
      {model: 'i10' , value: 'i10'},
      {model: 'i20' , value: 'i20'},
      {model: 'i30' , value: 'i30'},
      {model: 'i40' , value: 'i40'},
      {model: 'i30 fastback' , value: 'i30_fastback'},
      {model: 'Santafe' , value: 'Santafe'},
      {model: 'Tucson' , value: 'Tucson'},
      {model: 'Kona' , value: 'Kona'},
    ],
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
              //console.log( `Something went wrong` );
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
    const res = await this.db.fetchCars(id, this.glb.user.id);
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
      if (this.currentStep > 6) { // just for debug purpose (have to be === 7)
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
