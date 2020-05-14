import { Component, OnInit , ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { NavParams , ModalController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';
import { HttpEventType , HttpRequest , HttpClient, HttpEvent} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { GlobalsService } from 'src/app/services/globals.service';
import { UtilService } from 'src/app/services/util.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {NgbTimepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'src/app/services/login.service';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import { booking_status } from 'src/app/interfaces/booking_status';
import { booking_state } from 'src/app/interfaces/booking_state';
import { rent_state } from 'src/app/interfaces/rent_state';

@Component({
  selector: 'app-booking-out',
  templateUrl: './booking-out.page.html',
  styleUrls: ['./booking-out.page.scss'],
})
export class BookingOutPage implements OnInit {

  @ViewChild('bookingOut' , {static: true}) bookingOut?: IonSlides;
  public uploadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public downloadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  idAgency;
  type;
  steps = 0;
  step = 0;
  cars;
  price;
  totalPrice
  caution;
  car = null;
  fname = '';
  lname = '';
  adresse = '';
  telephone ='';
  licenseDate = new Date();
  email = '';
  dayDiff : number ;
  disabledDates_start;
  cal = [];
  ST: NgbTimeStruct = {hour: 10, minute: 0, second: 0};
  ET: NgbTimeStruct = {hour: 10, minute: 0, second: 0};
  license = {
    recto : null as FormData,
    verso : null as FormData,
    picsMeta: {
      recto : [false , false, 0, ' ' ],
      verso : [false , false, 0, ' ' ]
    }
  };
  licenseRecro ='licenseOut/recto.jpg';
  licenseVerso ='licenseOut/verso.jpg';

  isToday =  { year : new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()};

 

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  constructor(
    public modalCtrl: ModalController,
    private glb: GlobalsService,
    private loading: LoadingService,
    private db: DbinteractionsService,
    private http: HttpClient,
    private util :UtilService,
    private authService: LoginService,
    public  navParams:NavParams,
    public calendar: NgbCalendar,
    private load: LoadingService,
  ) { 
    this.markDisabled = this.markDisabled.bind(this);
  }

  ngOnInit() {
    this.idAgency = this.navParams.get('id');
    this.type = parseInt(this.navParams.get('actionType'));
  }

  public closeModal(res) {
    this.modalCtrl.dismiss({dismissed: true, res: res});
  }

  async finalize() {
      //this.closeModal(res);
  }

  slideNext(slideView){
    if(this.checkStep(this.step)){
      this.step = this.step +1 ;
      this.bookingOut.lockSwipes(false);
      this.steps = (this.steps + 0.5) > 1 ? 1 : this.steps + 0.5;
      slideView.slideNext(500);
      this.bookingOut.lockSwipes(true);
    }
    if (this.step === 2){
      let tsStart = new Date((this.fromDate.year), this.fromDate.month -1, this.fromDate.day);
      let tsEnd = new Date((this.toDate.year), this.toDate.month -1, this.toDate.day);
      let daysdif = (tsEnd.getTime() - tsStart.getTime()) / 1000;
      daysdif = daysdif / 60;
      daysdif = daysdif / 60;
      daysdif = daysdif / 24;
      this.dayDiff = daysdif;
      this.totalPrice = this.dayDiff  * this.price;
    }
    if (this.step >= 3){
      this.book()
    }
  }
  
 
  onSearchChange(ev){
    this.totalPrice = this.dayDiff  * this.price;
  }

  slidePrev(slideView){
    this.step -= 1;
    this.bookingOut.lockSwipes(false);
    this.steps = (this.steps - 0.5) < 0  ? 0 : this.steps - 0.5;
    slideView.slidePrev(500);
    this.bookingOut.lockSwipes(true);
  }

  checkStep(step) {
    switch (step){
      case 0 :
        if (this.car !== null && this.fromDate != null && this.toDate !== null){
          return true;
        }
      case 1 :
        if (this.fname !== '' && this.lname != ''){
          return true;
        }
        break
      case 2 : 
       if (this.price !== 0 && this.dayDiff !==0){
         return true;
        } 
        break
    }
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      if (this.toDate !== null && this.fromDate !== null) {
        let tsStart = new Date((this.fromDate.year), this.fromDate.month -1, this.fromDate.day);
        let tsEnd = new Date((date.year), date.month -1, date.day);
        for (let i=0; i<this.cal.length; i++){
            let ts = new Date(this.cal[i].year, this.cal[i].month - 1, this.cal[i].day);
            if (ts > tsStart && ts < tsEnd ){
              this.toDate = null;
              this.fromDate = null;
              return;
            }
          }
        }
    } else {
      this.toDate = null;
      this.fromDate = date; 
     }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }


  markDisabled(date: NgbDate, current: {year: number, month: number}): boolean {
    return this.isDisable(date) !== '';
  }

  isDisable(date: NgbDate): string {
    const holiday = this.cal.find(h => h.day === date.day && h.month === date.month && h.year === date.year);
    return holiday ? holiday.text : '';
  }

 

  updateSelect(){
    this.cal = [];
    // hide outdate date

    for (let i=1 ; i< this.isToday.day; i++){
      let tmp = {year: this.isToday.year,  month: this.isToday.month, day: i, text: 'outdate'};
      this.cal.push(tmp);
    }
    if (this.car !== null){
       this.price = this.car['pricePerDay'];
       let carBookedInside = this.car['carBookedInside'].split(',');
       for (let i = 0; i<carBookedInside.length; i++){
        const y = parseInt(carBookedInside[i].split('/')[0]);
        const m = parseInt(carBookedInside[i].split('/')[1]);
        const d = parseInt(carBookedInside[i].split('/')[2]);
        const t = 'booked inside';
        let tmp = {year: y,  month: m, day: d, text: t};
        this.cal.push(tmp);
       }
       let carBookedOutside = this.car['carBookedOutside'].split(',');
       for (let i = 0; i<carBookedOutside.length; i++){
        const y = parseInt(carBookedOutside[i].split('/')[0]);
        const m = parseInt(carBookedOutside[i].split('/')[1]);
        const d = parseInt(carBookedOutside[i].split('/')[2]);
        const t = 'carBookedOutside';
        let tmp = {year: y,  month: m, day: d, text: t};
        this.cal.push(tmp);
       }
       let carBusy = this.car['carBusy'].split(',');
       for (let i = 0; i<carBusy.length; i++){
        const y = parseInt(carBusy[i].split('/')[0]);
        const m = parseInt(carBusy[i].split('/')[1]);
        const d = parseInt(carBusy[i].split('/')[2]);
        const t = 'booked carBusy';
        let tmp = {year: y,  month: m, day: d, text: t};
        this.cal.push(tmp);
       }
       let carPreBooked = this.car['carPreBooked'].split(',');
       for (let i = 0; i<carPreBooked.length; i++){
        const y = parseInt(carPreBooked[i].split('/')[0]);
        const m = parseInt(carPreBooked[i].split('/')[1]);
        const d = parseInt(carPreBooked[i].split('/')[2]);
        const t = 'booked carPreBooked';
        let tmp = {year: y,  month: m, day: d, text: t};
        this.cal.push(tmp);
       }
   
  }
}

  async book(){
    let bookingStatus = booking_status.booked_outside;
    let bookingState = booking_state.booked_paid;
    let rentState = rent_state.waiting_for_start;
    let validPaiement = 0;
    let com_agency = 0;
    let com_platform = 0;
    let com_client = 0;
    let sDate = this.fromDate.year + '-' + this.fromDate.month + '-'  + this.fromDate.day + ' 00:00:00';
    let eDate = this.toDate.year + '-' + this.toDate.month + '-'  + this.toDate.day + ' 00:00:00';
    let sH = this.ST.hour.toString() + ':' + this.ST.minute.toString();
    let eH = this.ET.hour.toString() + ':' + this.ET.hour.toString();


    if (this.license.picsMeta.recto[0] === false){
      this.licenseRecro = '';
    } 
    if (this.license.picsMeta.verso[0] === false){
      this.licenseVerso = '';
    }

    

  

    this.load.presentLoading();

    const book = {

      totalprice: this.totalPrice,
      unitPrice : this.price,
      startdate: sDate,
      starttime : sH,
      enddate: eDate,
      endtime : eH,
      adress : this.adresse,
      validPaiement : validPaiement,
      com_platform : com_platform,
      com_agency : com_agency,
      com_client : com_client,
      idClient: '-1',
      lname : this.lname,
      fname : this.fname,
      adressClient : this.adresse,
      email : this.email,
      caution : this.caution,
      tel : this.telephone,
      licenseExp : this.licenseDate,
      car: this.car,
      days: this.dayDiff,
      idCar: this.car['id'],
      booking_status : bookingStatus,
      booking_state : bookingState,
      rent_state : rentState,
      idAgency: this.car['ownerID'],
      car_brand: this.car['brand'],
      car_model: this.car['model'],
      licenseRecto : this.licenseRecro,
      licenseVerso : this.licenseVerso
    
    };
    console.log(book);
    if (this.authService.isLoggedIn()) {
      const res = await this.db.reserveCarOut(book);
      if (res['status'] === 'success') {
        this.load.dismissLoading();
        this.closeModal(res['data']);
      }
    }
    this.load.dismissLoading();

  }

  uploadPic(val: string) {
    const elem = document.getElementById(val + 'file');
    elem.click();
    elem.onchange = () => {
      this.license.picsMeta[val][0] = false;
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
        const req = new HttpRequest('POST', this.glb.hostServer + 'licenseoutside.php' , formdata , {
          reportProgress: true
        });

        const some = this.http.request(req).subscribe((event: HttpEvent<any>) => {
          let status;
          console.log(event);
          switch (event.type) {
            case HttpEventType.Sent:
              console.log(`Uploading Files`);
              this.license.picsMeta[val][0] = true;
              break;
            case HttpEventType.UploadProgress:
              status = Math.round(event.loaded / event.total);
              this.license.picsMeta[val][2] = status;
              console.log(`Files are ${status}% uploaded`);
              break;
            case HttpEventType.DownloadProgress:
              status = Math.round(100 * event.loaded / event.total);
              this.downloadProgress.next(status); 
              console.log(`Files are ${status}% downloaded`);
              break;
            case HttpEventType.Response:
              this.license.picsMeta[val][1] = true;
              this.license.picsMeta[val][3] = this.glb.hostServer + event.body['path'];
              if (val = 'recto'){
                this.licenseRecro = event.body['path'];
              } else {
                this.licenseVerso = event.body['path'];
              }
              this.license.picsMeta[val][2] = 1;
              console.log( `Done` );
              break;
            default:
              console.log( `Something went wrong` );
          }
        }, err => {
          console.error(err);
        });
        switch (val) {
          case 'recto':
            this.license.recto = formdata;
            break;
          case 'verso':
            this.license.verso = formdata;
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


  async ionViewWillEnter() {
    //TODO opimize if this.glb.cars exist
    const res = await this.db.FetchCarToBookOut(this.idAgency);
    if (res['status'] === 'success'){
        this.cars = res['data'];
    }
    this.bookingOut.lockSwipes(true);
  }

}
