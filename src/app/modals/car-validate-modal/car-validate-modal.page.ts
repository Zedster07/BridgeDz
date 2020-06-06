

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
  selector: 'app-car-validate-modal',
  templateUrl: './car-validate-modal.page.html',
  styleUrls: ['./car-validate-modal.page.scss'],
})
export class CarValidateModalPage implements OnInit {
  public uploadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public downloadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  @ViewChild('AddLicenseCarForm' , {static: true}) AddLicenseCarForm?: IonSlides;

  steps = 0;
  currentStep = 1;

  formData = [
    {
      car_doc_id: '',
      car_pic : null as FormData,
      picsMeta: {
        license : [false , false, 0, '']
      } 
    },
    {
      insu_id: '',
      insu_exp: '',
      insu_pic: null as FormData,
      picsMeta: {
        insurance : [false , false, 0, '']
      }
    },
    {
      control_id: '',
      control_exp: null as FormData,
      cont_pic: null as FormData,
      picsMeta: {
        control : [false , false, 0, '']
      }
    },
  ];
   
  carData :any;
  type = 0;

  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    slideShadows: true,
  };


  constructor(
    public modalCtrl: ModalController,
    private glb: GlobalsService,
    private loading: LoadingService,
    private db: DbinteractionsService,
    private http: HttpClient,
    private util :UtilService,
    public  navParams:NavParams) {
    }
 

    uploadPic(val: string) {
      const elem = document.getElementById(val + 'file');
      elem.click();
      elem.onchange = () => {
        switch (val){
          case 'license': 
            this.formData[0].picsMeta[val][0] = false;
          break;
          case 'insurance': 
            this.formData[1].picsMeta[val][0] =false;
          break;
          case 'control': 
            this.formData[2].picsMeta[val][0] = false;
          break;
         }
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
                switch (val){
                  case 'license': 
                    this.formData[0].picsMeta[val][0] = true;
                  break;
                  case 'insurance': 
                    this.formData[1].picsMeta[val][0] = true;
                  break;
                  case 'control': 
                    this.formData[2].picsMeta[val][0] = true;
                  break;
                 }
                break;
              case HttpEventType.UploadProgress:
                status = Math.round(event.loaded / event.total);
                switch (val){
                  case 'license': 
                    this.formData[0].picsMeta[val][2] = true;
                  break;
                  case 'insurance': 
                    this.formData[1].picsMeta[val][2] = true;
                  break;
                  case 'control': 
                    this.formData[2].picsMeta[val][2] = true;
                  break;
                 }
            
                //console.log(`Files are ${status}% uploaded`);
                break;
              case HttpEventType.DownloadProgress:
                status = Math.round(100 * event.loaded / event.total);
                this.downloadProgress.next(status); 
                //console.log(`Files are ${status}% downloaded`);
                break;
              case HttpEventType.Response:
                switch (val){
                  case 'license': 
                    this.formData[0].picsMeta[val][1] = true;
                    this.formData[0].picsMeta[val][3] = this.glb.hostServer + event.body['path'];
                    this.formData[0].picsMeta[val][2] = 1;
                    const picError = document.getElementById('license' + 'item');
                    picError.style.color = 'green';
                  break;
                  case 'insurance': 
                    this.formData[1].picsMeta[val][1] = true;
                    this.formData[1].picsMeta[val][3] = this.glb.hostServer + event.body['path'];
                    this.formData[1].picsMeta[val][2] = 1;
                    const picError_1 = document.getElementById('insurance' + 'item');
                    picError_1.style.color = 'green';
                  break;
                  case 'control': 
                    this.formData[2].picsMeta[val][1] = true;
                    this.formData[2].picsMeta[val][3] = this.glb.hostServer + event.body['path'];
                    this.formData[2].picsMeta[val][2] = 1;
                    const picError_2 = document.getElementById('control' + 'item');
                    picError_2.style.color = 'green';
                  break;
                 }
           
                
                //console.log( `Done` );
                break;
              default:
                //console.log( `Something went wrong` );
            }
          }, err => {
            console.error(err);
          });
          switch (val) {
            case 'license':
              this.formData[0].car_pic = formdata;
              break;
            case 'insurance':
              this.formData[1].insu_pic = formdata;
              break;
            case 'control':
              this.formData[2].control_exp = formdata;
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

  checkStep(step) {
    let toReturn = true;
      switch (step) {
        
        case 1:  
          const car_doc_id = document.getElementById('car_doc_id');
          this.util.debug('car_doc_id', car_doc_id);
          this.util.debug('step', step);
          if ( this.formData[0].car_doc_id === '' ) {
            car_doc_id.style.border = '1px solid red';
            toReturn = false;
          } else {
            car_doc_id.style.border = '1px solid green';
          }
          if (this.formData[0].picsMeta['license'][3] === '' || this.formData[0].picsMeta['license'][2]=== 0){
            const picError = document.getElementById('license' + 'item');
            picError.style.color = 'red';
            toReturn = false;
          } else {
            const picError = document.getElementById('license' + 'item');
            picError.style.color = 'green';
          }
          return toReturn;
        break;

        case 3:
        const control_id = document.getElementById('control_id');
        const control_exp = document.getElementById('control_exp');
        if ( this.formData[2].control_id === '' ) {
          control_id.style.border = '1px solid red';
          toReturn = false;
        } else {
          control_id.style.border = '1px solid green';
        } 
          if ( this.formData[2].control_id === '' ) {
            control_exp.style.border = '1px solid red';
            toReturn = false;
          } else {
            control_exp.style.border = '1px solid green';
          }

        if (this.formData[2].picsMeta['control'][3] === ''|| this.formData[2].picsMeta['control'][2]=== 0){
          const picError = document.getElementById('control' + 'item');
          picError.style.color = 'red';
          toReturn = false;
        } else {
          const picError = document.getElementById('control' + 'item');
          picError.style.color = 'green';
        }
        return toReturn;
        case 2:
          
        const insu_id = document.getElementById('insu_id');
        const insu_exp = document.getElementById('insu_exp');
        this.util.debug('insu_id', insu_id);
          this.util.debug('step', step);
        if ( this.formData[1].insu_id === '' ) {
          insu_id.style.border = '1px solid red';
          toReturn = false;
        } else {
          insu_id.style.border = '1px solid green';
        }
        if ( this.formData[1].insu_exp === '' ) {
          insu_exp.style.border = '1px solid red';
          toReturn = false;
        } else {
           insu_exp.style.border = '1px solid green';
        }
        if (this.formData[1].picsMeta['insurance'][3] === '' || this.formData[1].picsMeta['insurance'][2]=== 0){
          const picError = document.getElementById('insurance' + 'item');
          picError.style.color = 'red';
          toReturn = false;
        } else {
          const picError = document.getElementById('insurance' + 'item');
          picError.style.color = 'green';
        }
        return toReturn;
        default:
          break;
      }
     return toReturn;;
    }
 

    async updateVehicleInfo(index) {
      this.loading.presentLoading_generic('LOGIN.LOADING_WAIT_1'); //TODO
      const resp =  await this.db.dbUpdateCarLic(this.formData, index); //Add security backend
      console.log(resp)
      if (resp) {
        console.log('success');
        this.finalize();
        this.loading.dismissLoading();
      } else {
        this.loading.dismissLoading();
      } 
    } 

    slideNext(slideView) {
      if (this.checkStep(this.currentStep)) {
        this.AddLicenseCarForm.lockSwipes(false);
        this.steps = (this.steps + 0.5) > 1 ? 1 : this.steps + 0.5;
        this.util.debug('this.steps', this.steps);
        slideView.slideNext(1000);
        this.AddLicenseCarForm.lockSwipes(true);
        this.currentStep += 1;
        console.log( this.currentStep);
        if (this.currentStep === 4 && this.type === 1) { // just for debug purpose (have to be === 7)
          this.updateVehicleInfo(this.carData['id']);
          this.util.debug('formData', this.formData);
        }
  
      }
    }

    slidePrev(slideView) {
      this.currentStep -= 1;
      this.AddLicenseCarForm.lockSwipes(false);
      this.steps = (this.steps - 0.5) < 0  ? 0 : this.steps - 0.5;
      slideView.slidePrev(500);
      this.AddLicenseCarForm.lockSwipes(true);
    }


  close() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  public closeModal() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  async finalize() {
      this.closeModal();
  }

  async ngOnInit() {
    this.AddLicenseCarForm.lockSwipes(false);
    this.carData = this.navParams.get('data');
    this.type = parseInt(this.navParams.get('actionType'));
    this.AddLicenseCarForm.update();

      const resp =  await this.db.FetchCarLicense(this.carData['id']);//Add security backend
      if(resp.status ==='success'){
         this.formData[0].car_doc_id = resp.data['car_doc_id'];
         if (resp.data['car_pic'] !== ''){
          this.formData[0].picsMeta['license'][0] = true;
          this.formData[0].picsMeta['license'][1] = true;
          this.formData[0].picsMeta['license'][2] = 1;
          this.formData[0].picsMeta['license'][3] = this.glb.hostServer + resp.data['car_pic'];
          }  else {
            this.formData[0].picsMeta['license'][0] = false;
            this.formData[0].picsMeta['license'][1] = false;
            this.formData[0].picsMeta['license'][2] = 0;
            this.formData[0].picsMeta['license'][3] = "../../../../../assets/icons/document.svg";
          }  
         this.formData[1].insu_id = resp.data['insu_Id'];
         this.formData[1].insu_exp = resp.data['insu_exp'];
         if (resp.data['insu_pic'] !== ''){
            this.formData[1].picsMeta['insurance'][0] = true;
            this.formData[1].picsMeta['insurance'][1] = true;
            this.formData[1].picsMeta['insurance'][2] = 1;
            this.formData[1].picsMeta['insurance'][3] = this.glb.hostServer + resp.data['insu_pic'];
          }  else {
            this.formData[1].picsMeta['insurance'][0] = false;
            this.formData[1].picsMeta['insurance'][1] = false;
            this.formData[1].picsMeta['insurance'][2] = 0;
            this.formData[1].picsMeta['insurance'][3] = "../../../../../assets/icons/document.svg";
          }  
         this.formData[2].control_id = resp.data['control_id'];
         this.formData[2].control_exp = resp.data['control_exp'];
         if (resp.data['control_pic'] !== ''){
         this.formData[2].picsMeta['control'][0] = true;
         this.formData[2].picsMeta['control'][1] = true;
         this.formData[2].picsMeta['control'][1] = 1;
         this.formData[2].picsMeta['control'][3] = this.glb.hostServer +  resp.data['control_pic'];
         }  else {
          this.formData[2].picsMeta['control'][0] = false;
          this.formData[2].picsMeta['control'][1] = false;
          this.formData[2].picsMeta['control'][1] = 0;
          this.formData[2].picsMeta['control'][3] = "../../../../../assets/icons/document.svg";
        } 
      } else {
        this.util.debug('no car data info', 'do');
        this.formData[0].picsMeta['license'][3] = "../../../../../assets/icons/document.svg";
        this.formData[0].picsMeta['license'][0] = false;
        this.formData[0].picsMeta['license'][1] = false;
        this.formData[0].picsMeta['license'][2] = 0;
        this.formData[1].picsMeta['insurance'][3] ="../../../../../assets/icons/document.svg";
        this.formData[1].picsMeta['insurance'][0] = false;
        this.formData[1].picsMeta['insurance'][1] = false;
        this.formData[1].picsMeta['insurance'][2] = 0;
        this.formData[2].picsMeta['control'][3] ="../../../../../assets/icons/document.svg";
        this.formData[2].picsMeta['control'][0] = false;
        this.formData[2].picsMeta['control'][1] = false;
        this.formData[2].picsMeta['control'][2] = 0;
      }
  
    
  }

  ionViewWillEnter(){
    this.AddLicenseCarForm.lockSwipes(false);
    this.AddLicenseCarForm.update();
  } 


}
