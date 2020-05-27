import { Component, OnInit, ViewChild } from '@angular/core';
 import { NavParams, IonSlides, ModalController } from '@ionic/angular';
 import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
 import { HttpRequest, HttpEvent, HttpClient, HttpEventType } from '@angular/common/http';
 import { GlobalsService } from 'src/app/services/globals.service';

 @Component({
   selector: 'app-start-loc-agency',
   templateUrl: './start-loc-agency.page.html',
   styleUrls: ['./start-loc-agency.page.scss'],
 })
 export class StartLocAgencyPage implements OnInit {
   @ViewChild('Inventaire' , {static: true}) Inventaire: IonSlides;
   constructor(
     private navParams: NavParams,
     private db: DbinteractionsService,
     private glb: GlobalsService,
     private http: HttpClient,
     private modalCtrl: ModalController
   ) { }
   step = 1;
   inv_step ;
   type_book ;
   bookData = '';
   isloading = false;
   msg = 'Uploading the pictures ...';
   pictures = {
     fll: null as FormData,
     flr: null as FormData,
     bll: null as FormData,
     blr: null as FormData,
     inside: null as FormData
   };
   uploaded = {
     fll: '',
     flr: '',
     bll: '',
     blr: '',
     inside: ''
   };
   slideOptsOne = {
     initialSlide: 0,
     slidesPerView: 1,
     autoplay: false,
   };

   confirmInv() {
     for (const key in this.pictures) {
       if (this.pictures.hasOwnProperty(key)) {
         let formdata = new FormData();
         formdata = this.pictures[key];
         const req = new HttpRequest('POST', this.glb.hostServer + 'inverntaire.php' , formdata , {
           reportProgress: true
         });
         this.http.request(req).subscribe((event: HttpEvent<any>) => {
           console.log(event);
           switch (event.type) {
             case HttpEventType.Response:
               this.uploaded[key] = event.body['path'];
               break;
             default:
               break;
           }
         }, err => {
           console.error(err);
         });
       }
     }
     this.msg = 'pictures uploaded successfully';
     this.isloading = false;
   }
   close() {
     this.modalCtrl.dismiss({
       dismissed: true
     });
   }
   async slideNext(slideView) {
     console.log(this.step);
     if (this.step === 6 ) {
       if (this.isloading === false ) {
         this.msg = 'Waiting a moment ...';
         if (this.inv_step === 0) {
         const res = await this.db.startLocnew(this.bookData['bid'] , this.uploaded , this.bookData['clientID'], this.inv_step, this.type_book);
         if (res['status'] === 'success') {
          this.close();
           } 
         } else if (this.inv_step === 1){
          const res = await this.db.endLocnew(this.bookData['bid'] , this.uploaded , this.bookData['clientID'], this.inv_step, this.type_book);
          if (res['status'] === 'success') {
            this.close();
             } 
         }
       }
     }
     if ( this.step === 5 ) {
       this.isloading = true;
       this.step = this.step + 1;
       this.Inventaire.lockSwipes(false);
       slideView.slideNext(500);
       this.Inventaire.lockSwipes(true);
       this.confirmInv();
     }
     this.step = this.step < 5 ? this.step + 1 : this.step;
     this.Inventaire.lockSwipes(false);
     let xx = await this.Inventaire.update();
     slideView.slideNext(500);
     this.Inventaire.lockSwipes(true);
   }

   slidePrev(slideView) {
     this.step = this.step > 1 ? this.step - 1 : this.step;
     this.Inventaire.lockSwipes(false);
     slideView.slidePrev(500);
     this.Inventaire.lockSwipes(true);
   }

   uploadPic(pic: string) {
     const elem = document.getElementById(pic + 'file');
     elem.click();
     elem.onchange = () => {
       const file = (<HTMLInputElement>document.getElementById(pic + 'file')).files[0];
       const preview = document.getElementById(pic);
       const reader  = new FileReader();

       reader.onloadstart = () => {
         // this.loading.presentLoading();
       };
       reader.onload = () => {
         const formdata = new FormData();
         formdata.append('file' , file); formdata.append('pictype' , pic); formdata.append('bookid' , this.bookData['bid']);
         this.pictures[pic] = formdata;
         preview.style.backgroundImage = 'url("' + reader.result + '")';
       };
       reader.onloadend = () => {
         // this.loading.dismissLoading();
       };
       reader.readAsDataURL(file);
     };
   }
   alertt() {
     const elem = document.getElementById('test');
     elem.click();
   }
   async ngOnInit() {
     this.Inventaire.lockSwipes(true);
     this.bookData = this.navParams.get('data');
     this.inv_step = this.navParams.get('inv_step');
     this.type_book = this.navParams.get('type_book');
     //const res = await this.db.startLocA(this.bookData);
   }
 }