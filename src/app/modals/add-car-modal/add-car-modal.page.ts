import { Component, OnInit , ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { NavParams , ModalController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';
import { HttpEventType , HttpRequest , HttpClient, HttpEvent} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { GlobalsService } from 'src/app/services/globals.service';
import { UtilService } from 'src/app/services/util.service';
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
  adresse = [
    {
      city: 'Alger' ,
      lat: '36.7753606',
      lon: '3.0601882',
    },
    {
      city: 'Oran' ,
      lat: '35.7032751',
      lon: '-0.6492976',
    },
    {
      city: 'Constantine' ,
      lat: '36.364519',
      lon: '6.60826',
    },
    {
      city: 'Annaba' ,
      lat: '36.8982165',
      lon: '7.7549272',
    },
    {
      city: 'Blida' ,
      lat: '36.4701645',
      lon: '2.8287985',
    },
    {
      city: 'Batna' ,
      lat: '35.3384291',
      lon: '5.7315453',
    },
    {
      city: 'Djelfa' ,
      lat: '34.342841',
      lon: '3.2172531',
    },
    {
      city: 'Sétif' ,
      lat: '36.1892751',
      lon: '5.403493',
    },
    {
      city: 'Sidi bel Abbès' ,
      lat: '34.682268',
      lon: '-0.4357555',
    },
    {
      city: 'Biskra' ,
      lat: '34.320341',
      lon: '4.7246792',
    },
    {
      city: 'Tébessa' ,
      lat: '35.124945',
      lon: '7.9011735',
    },
    {
      city: 'El Oued' ,
      lat: '33.215441',
      lon: '7.1553214',
    },
    {
      city: 'Skikda' ,
      lat: '36.7545115',
      lon: '6.8856255',
    },
    {
      city: 'Tiaret' ,
      lat: '34.8947575',
      lon: '1.5945792',
    },
    {
      city: 'Béjaia' ,
      lat: '36.7511783',
      lon: '5.0643687',
    },
    {
      city: 'Tlemcen' ,
      lat: '34.881789',
      lon: '-1.316699',
    },
    {
      city: 'Ouargla' ,
      lat: '30.9980145',
      lon: '6.7664536',
    },
    {
      city: 'Béchar' ,
      lat: '29.8607761',
      lon: '-2.880289',
    },
    {
      city: 'Mostaganem' ,
      lat: '36.0026915',
      lon: '0.3686867',
    },
    {
      city: 'Bordj Bou Arreridj' ,
      lat: '36.095506',
      lon: '4.6611002',
    },
    {
      city: 'Chlef ' ,
      lat: '36.20342',
      lon: '1.2680696',
    },
    {
      city: 'Souk Ahras' ,
      lat: '36.1378681',
      lon: '7.8262426',
    },
    {
      city: 'Médéa' ,
      lat: '35.9752045',
      lon: '3.0123504',
    },
    {
      city: 'Tindouf' ,
      lat: '36.1529057',
      lon: '5.6911588',
    },
    {
      city: 'El Tarf' ,
      lat: '36.6713563',
      lon: '8.070134',
    },
    {
      city: 'El Eulma' ,
      lat: '36.1529057',
      lon: '5.6911588',
    },
    {
      city: 'Touggourt' ,
      lat: '36.1529057',
      lon: '5.6911588',
    },
    {
      city: 'Ghardaïa ' ,
      lat: '30.979872',
      lon: '3.0990851',
    },
    {
      city: 'Saïda' ,
      lat: '34.743349',
      lon: '0.2440764',
    },
    {
      city: 'Laghouat' ,
      lat: '33.7504405',
      lon: '2.6431094',
    },
    {
      city: 'MSila' ,
      lat: '35.1300205',
      lon: '4.2003107',
    },
    {
      city: 'Jijel' ,
      lat: '36.7292188',
      lon: '5.9607776',
    },
    {
      city: 'Relizane' ,
      lat: '35.8363185',
      lon: '0.9118537',
    },
    {
      city: 'Guelma ' ,
      lat: '36.3491635',
      lon: '7.409499',
    },
    {
      city: 'Aïn Beïda' ,
      lat: '35.7952839',
      lon: '7.3894346',
    },
    {
      city: 'Khenchela' ,
      lat: '34.9133455',
      lon: '6.9059431',
    },
    {
      city: 'Bousaada' ,
      lat: '35.2133123',
      lon: '4.1809702',
    },
    {
      city: 'Mascara' ,
      lat: '35.3978385',
      lon: '0.2430195',
    },
    {
      city: 'Tizi ouzzou' ,
      lat: '36.6816175',
      lon: '4.237186',
    },
  ];

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
  searchResults =[];
  formData = [
    {
      marque: [ '0' , 'marque' ],
      model: ['0' , 'modele'],
      matricule : '',
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
      address: ['' , 'adresserdv'],
      lat: '',
      lon: '',
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
    },
    {
      caution : false,
      caution_value : 100,
      Km : 300,
      Km_price : 0.1,
      license_seniority : 2,
      pieces : {
        identinty : true,
        driving : true,
        passport : true
      },
      foreign_accepted : true
    }
  ];

  carData :any;
  type = 0;

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
    private http: HttpClient,
    private util :UtilService,
    public  navParams:NavParams) {}

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
          //console.log(event);
          switch (event.type) {
            case HttpEventType.Sent:
              //console.log(`Uploading Files`);
              this.formData[5].picsMeta[val][0] = true;
              break;
            case HttpEventType.UploadProgress:
              status = Math.round(event.loaded / event.total);
              this.formData[5].picsMeta[val][2] = status;
              //console.log(`Files are ${status}% uploaded`);
              break;
            case HttpEventType.DownloadProgress:
              status = Math.round(100 * event.loaded / event.total);
              this.downloadProgress.next(status); 
              //console.log(`Files are ${status}% downloaded`);
              break;
            case HttpEventType.Response:
              this.formData[5].picsMeta[val][1] = true;
              this.formData[5].picsMeta[val][3] = this.glb.hostServer + event.body['path'];
              this.formData[5].picsMeta[val][2] = 1;
              //console.log( `Done` );
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
    //.log(this.formData);
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
      case 5:
        const addresserror = document.getElementById(this.formData[3].address[1]);
        if (this.formData[3].address[0] === '') {
          addresserror.style.border = '1px solid red';
          return false;
        } else {
          addresserror.style.border = '1px solid green';
          return true;
        }
      case 6:
        const prixerror = document.getElementById(this.formData[4].prix[1]);
        if (Number(this.formData[4].prix[0]) <= 0 ) {
          prixerror.style.border = '1px solid red';
          return false;
        } else {
          prixerror.style.border = '1px solid green';
          return true;
        }
      case 7:
        const pics = ['avant' , 'arriere' , 'cote1' , 'cote2' , 'inside'];
        let i = 0;
        let count = 0;
        for (const key in this.formData[5]) {
          if (this.formData[5].hasOwnProperty(key)) {
            const picError = document.getElementById(pics[i] + 'item');
           
            if (key !== 'picsMeta') {
              if (!this.formData[5]['picsMeta'][key][1]) {
                console.log("not ok");
                console.log(this.formData[5][key]);
                console.log(this.formData[5]['picsMeta'][key]);
                picError.style.color = 'red';
              } else {
                console.log(" ok");
                console.log(this.formData[5][key]);
                console.log(this.formData[5]['picsMeta'][key]);
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
          picsList += this.formData[5].picsMeta[key][3].replace(this.glb.hostServer, '');
        }
        i += 1;
      }
    }
    return picsList;
  }

  getPicList(picList:string, index) {
    if(index < 5){
      return picList.split(',')[index];
    } else {
      return null;
    }
  }
  
  generateOptionsList(listInput) {
    let list = ''; let i = 0;
    for (const key in listInput) {
      if (listInput.hasOwnProperty(key)) {
        if (i !== 0) {
          list += ',';
        }
        if (listInput[key] === true) {
          list += '1';
        } else {
          list += '0';
        }
        i += 1;
      }
    }
    return list;
  }

  getOptionlist(option: string, index){
    if(index < 7){
      //this.util.debug('index', index);
      //this.util.debug('value', option.split(',')[index]);
      if(option.split(',')[index] === '1') {
        return true;
      } else {
        return false;
      }
    } else {
      return null;
    }
  }

  async updateCar(id){
    this.loading.presentLoading();
    const formdata = new FormData();
    const picsList = this.generateCarPicsList();
    const optionsList = this.generateOptionsList(this.formData[2]);
    const optionsRenting = this.generateOptionsList(this.formData[6].pieces);
    console.log("optionsRenting");
    console.log(optionsRenting);
    const resp =  await this.db.dbUpdateCar(this.formData, picsList, optionsList, optionsRenting, id); //Add security backend
    console.log(resp)
    if (resp) {
      console.log('success');
      this.finalize();
      this.loading.dismissLoading();
    } else {
      this.loading.dismissLoading();
    } 
  } 
  async confirmAddCar() {
    this.loading.presentLoading();
    const formdata = new FormData();
    const picsList = this.generateCarPicsList();
    const optionsList = this.generateOptionsList(this.formData[2]);
    const optionsRenting = this.generateOptionsList(this.formData[6].pieces);
    console.log("optionsRenting");
    console.log(optionsRenting);
    let car_guid = this.util.newGuid();
    console.log(car_guid);
    const resp =  await this.db.dbconfirmAddCar(this.formData, picsList, optionsList, optionsRenting, car_guid);
    console.log(resp)
    if (resp) {
      console.log('success');
      this.finalize();
      this.loading.dismissLoading();
    } else {
      this.loading.dismissLoading();
    }   

  }
  async finalize() {
    const id = this.db.getStorage('accID');
    const res = await this.db.fetchCars(id, this.glb.user.id);
    if (res && res.status !== 'failure') {
      this.glb.cars = res.data;
      this.closeModal();
    }
  }
  public closeModal() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }
  async slideNext(slideView) {
    if (this.checkStep(this.currentStep)) {
      let w = await this.AddCarForm.update();
      this.AddCarForm.lockSwipes(false);
      this.steps = (this.steps + 0.16) > 1 ? 1 : this.steps + 0.16;
      slideView.slideNext(500);
      this.AddCarForm.lockSwipes(true);
      this.currentStep += 1;
      console.log( this.currentStep);
      if (this.currentStep === 8 && this.type === 0) { // just for debug purpose (have to be === 7)
        this.confirmAddCar();
      }
      if(this.currentStep === 8 && this.type === 1){ // just for debug purpose (have to be === 7)
        this.updateCar(this.carData['id']);
        this.util.debug('updateCar', this.carData['id']);
        this.util.debug('formData', this.formData);
      }

    }
  }

  slidePrev(slideView) {
    this.currentStep -= 1;
    this.AddCarForm.lockSwipes(false);
    this.steps = (this.steps - 0.16) < 0  ? 0 : this.steps - 0.16;
    slideView.slidePrev(500);
    this.AddCarForm.lockSwipes(true);
  }


  ngOnInit() {
    this.AddCarForm.lockSwipes(true);
    this.type = this.navParams.get('actionType');
    this.carData = this.navParams.get('data');
    if (this.navParams.get('actionType') === '1') {

        this.type = 1;

        this.formData[0].marque[0] = this.carData['brand'];
        this.formData[0].model[0] = this.carData['model'];
        this.formData[0].matricule = this.carData['vin'];
        this.formData[1].carburant[0] = this.carData['engine'];
        this.formData[1].boitevitesse = this.carData['vitesse'];
        this.formData[3].address[0]= this.carData['city'];
        this.formData[3].lat= this.carData['lat'];
        this.formData[3].lon= this.carData['lon'];
        this.formData[4].prix[0] = this.carData['pricePerDay'];
        this.formData[2].needConf = false;
        this.formData[6].Km = this.carData['Km'];
        this.formData[6].Km_price = this.carData['Km_price'];
        this.formData[6].foreign_accepted = false;
        this.formData[6].license_seniority = this.carData['license_seniority'];
        this.formData[6].caution  = false;
        this.formData[6].caution_value =this.carData['caution_value'];

        if (this.carData['needConfirm'] !== '0'){
          this.formData[2].needConf = true;
        } 
        if (this.carData['caution'] !== '0'){
          this.formData[6].caution = true;
        } 
        if (this.carData['foreign_accepted'] !== '0'){
          this.formData[6].foreign_accepted  = true;
        }
  

        if (this.getOptionlist(this.carData['accepted_peices'], 0) !== null){
          this.formData[6].pieces.identinty = this.getOptionlist(this.carData['accepted_peices'], 0);
        } 
        if (this.getOptionlist(this.carData['accepted_peices'], 1) !== null){
          this.formData[6].pieces.driving = this.getOptionlist(this.carData['accepted_peices'], 1);
        } 
        if (this.getOptionlist(this.carData['accepted_peices'], 2) !== null){
          this.formData[6].pieces.passport = this.getOptionlist(this.carData['accepted_peices'], 2);
        } 

        if (this.getOptionlist(this.carData['options'], 0) !== null){
          this.formData[2].clim = this.getOptionlist(this.carData['options'], 0);
        } 
        if (this.getOptionlist(this.carData['options'], 1) !== null){
          this.formData[2].regvit = this.getOptionlist(this.carData['options'], 1);
        }
        if (this.getOptionlist(this.carData['options'], 2) !== null){
          this.formData[2].gps = this.getOptionlist(this.carData['options'], 2);
        }
        if (this.getOptionlist(this.carData['options'], 3) !== null){
          this.formData[2].siegebb = this.getOptionlist(this.carData['options'], 3);
        }
        if (this.getOptionlist(this.carData['options'], 4) !== null){
          this.formData[2].leCD = this.getOptionlist(this.carData['options'], 4);
        }
        
        this.formData[5].picsMeta['avant'][0] = true;
        this.formData[5].picsMeta['avant'][1] = true;
        this.formData[5].picsMeta['avant'][2] = 1;
        if (this.getPicList(this.carData['picturesList'], 0) !== null){
          this.formData[5].picsMeta['avant'][3] = this.glb.hostServer + this.getPicList(this.carData['picturesList'], 0);
           } 

        this.formData[5].picsMeta['arriere'][0] = true;
        this.formData[5].picsMeta['arriere'][1] = true;
        this.formData[5].picsMeta['arriere'][2] = 1;

        if (this.getPicList(this.carData['picturesList'], 1) !== null){
          this.formData[5].picsMeta['arriere'][3]  = this.glb.hostServer + this.getPicList(this.carData['picturesList'], 1);
           } 

        this.formData[5].picsMeta['cote1'][0] = true;
        this.formData[5].picsMeta['cote1'][1] = true;
        this.formData[5].picsMeta['cote1'][2] = 1;
        if (this.getPicList(this.carData['picturesList'], 2) !== null){
          this.formData[5].picsMeta['cote1'][3]  = this.glb.hostServer + this.getPicList(this.carData['picturesList'], 2);
           } 


        this.formData[5].picsMeta['cote2'][0] = true;
        this.formData[5].picsMeta['cote2'][1] = true;
        this.formData[5].picsMeta['cote2'][2] = 1;
        if (this.getPicList(this.carData['picturesList'], 3) !== null){
          this.formData[5].picsMeta['cote2'][3]  = this.glb.hostServer + this.getPicList(this.carData['picturesList'], 3);
           } 

        this.formData[5].picsMeta['inside'][0] = true;
        this.formData[5].picsMeta['inside'][1] = true;
        this.formData[5].picsMeta['inside'][2] = 1;
        if (this.getPicList(this.carData['picturesList'], 4) !== null){
          this.formData[5].picsMeta['inside'][3]  = this.glb.hostServer + this.getPicList(this.carData['picturesList'], 4);
           } 

           //this.util.debug('this.carData[picturesList', this.carData['options']);
      }  else {
        this.type = 0;
        this.formData[5].picsMeta['avant'][3] = '../../../assets/images/front.jpg';
        this.formData[5].picsMeta['arriere'][3] = '../../../assets/images/back.jpg';
        this.formData[5].picsMeta['cote1'][3]= '../../../assets/images/right.jpg';
        this.formData[5].picsMeta['cote2'][3] = '../../../assets/images/left.jpg';
        this.formData[5].picsMeta['inside'][3]= '../../../assets/images/interior.jpg';
      }

  }

  updateSearch(){
    this.searchResults = [];
    if (this.formData[3].address[0].length > 0 ){
        for (let i=0 ; i< this.adresse.length; i++){
          if (this.adresse[i].city.toLowerCase().includes(this.formData[3].address[0].toLowerCase())){
            this.searchResults.push(this.adresse[i]);
          } 
        }
    } 
  }
  chooseItem(item){
    this.formData[3].address[0] = item.city;
    this.formData[3].lat = item.lat;
    this.formData[3].lon = item.lon;
    this.searchResults = [];
  }

  

}
