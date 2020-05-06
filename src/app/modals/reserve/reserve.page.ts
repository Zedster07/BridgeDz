import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { NavParams, ModalController, PopoverController, IonSlides } from '@ionic/angular';
import { GlobalsService } from 'src/app/services/globals.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { booking_status } from 'src/app/interfaces/booking_status';
import { booking_state } from 'src/app/interfaces/booking_state';
import { rent_state } from 'src/app/interfaces/rent_state';
import { NgForm } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';


declare var Stripe: stripe.StripeStatic;

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.page.html',
  styleUrls: ['./reserve.page.scss'],
})
export class ReservePage implements OnInit {
  @ViewChild('reserve' , {static: true}) reserve: IonSlides;
  @ViewChild('cardElement' , {static: true}) cardElement: ElementRef;
  data = {};
  steps = 0;
  stripe;
  card;
  cardErrors;
  loading = false;
  confirmation;
  currentStep = 0;
  picsList = [];
  days = 0;
  slideOpts = {
    slidesPerView: 1.5,
    initialSlide: 0,
    speed: 400
  };
  slideOpts2 = {
    slidesPerView: 1,
    initialSlide: 0,
    speed: 400
  };


  constructor(
    private navParams: NavParams ,
    private glb: GlobalsService,
    private db: DbinteractionsService,
    private authService: LoginService,
    private route: Router,
    public modalController: ModalController,
    private load: LoadingService,
     ) { }


  public closeModal() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  /*slidenext(slideView) {
    this.reserve.lockSwipes(false);
    slideView.slideNext(500);
    this.reserve.lockSwipes(true);
  }
  slideprev(slideView) {
    this.reserve.lockSwipes(false);
    slideView.slidePrev(500);
    this.reserve.lockSwipes(true);
  }*/



  async reserverCar(validPaiement, id_transaction, id_source) {

    let bookingStatus ;
    let bookingState ;
    let rentState ;
    let com_agency;
    let com_platform;
    let com_client;
    this.load.presentLoading();

    if (this.data['needConfirm'] === '0'){
      
      bookingStatus = booking_status.booked_inside;
      bookingState = booking_state.booked_paid;
      rentState = rent_state.waiting_for_start;
      validPaiement = 0;
      com_agency = 0;
      com_platform = 0;
      com_client = 0;


    } else {
      console.log('this car is need confirm');
      bookingStatus = booking_status.booked_inside;
      bookingState = booking_state.pre_booked_1;
      rentState = rent_state.not_yet_validated;
      validPaiement = 0;
      com_agency = 0;
      com_platform = 0;
      com_client = 0;
    }

    const book = {
      totalprice: this.days * this.data['pricePerDay'],
      unitPrice : this.data['pricePerDay'],
      startdate: this.glb.searchQuery.startdate ,
      starttime : this.glb.searchQuery.starttime,
      enddate: this.glb.searchQuery.enddate,
      endtime : this.glb.searchQuery.endtime,
      adress : this.glb.searchQuery.address,
      validPaiement : validPaiement,
      com_platform : com_platform,
      com_agency : com_agency,
      com_client : com_client,
      idClient: this.glb.user.id,
      car: this.data,
      days: this.days,
      idCar: this.data['id'],
      booking_status : bookingStatus,
      booking_state : bookingState,
      rent_state : rentState,
      idAgency: this.data['ownerID'],
      car_brand: this.data['brand'],
      car_model: this.data['model'],
      id_transaction: id_transaction,
      id_source: id_source
    };

    if (this.authService.isLoggedIn()) {
      const res = await this.db.reserveCar(book);
      if (res['status'] === 'success') {
        this.load.dismissLoading();
        this.closeModal();
      }
    } else {
      //TODO Inform the client that the booking isn't done.
      this.load.dismissLoading();
      this.glb.prevAction = 'book';
      this.glb.prevBook = book;
      this.closeModal();
      this.route.navigate(['login']);
    }
  }

 
  ngOnInit() {
      this.stripe = Stripe('pk_test_UPMx010YZH8WXjU3c80hBcnf002I0ErB80');
      this.reserve.lockSwipes(true);
      this.data = this.navParams.get('data');
      console.log(this.data);
      this.days = this.navParams.get('days');
      let pics = this.data['picturesList'];
      let index = 0;
      while (pics !== '') {
        if (pics.indexOf(',') === -1) {
          this.picsList.push(pics);
          pics = '';
        } else {
          let indexEnd = pics.indexOf(',');
          let tmp = pics.substring(index , indexEnd);
          this.picsList.push(this.glb.hostServer + tmp);
          pics = pics.substring(indexEnd + 1);
          console.log('tmp = ' + tmp);
          console.log('pics = ' + pics);
        }
      }
      console.log(this.picsList);
      
  }

  slideNext(slideView) {
    this.reserve.lockSwipes(false);
    this.steps = (this.steps + 0.5) > 1 ? 1 : this.steps + 0.5;
    this.currentStep += 1;
    if (this.currentStep === 1 && (this.data['needConfirm'] === '0')){
      slideView.slideNext(500);
      this.reserve.lockSwipes(true);
      const elements = this.stripe.elements();
      this.card = elements.create('card');
      this.card.mount(this.cardElement.nativeElement);
      this.card.addEventListener('change', ({error}) => { 
      this.cardErrors = error && error.message;
      });
    }
    if (this.currentStep === 1 && (this.data['needConfirm'] === '1')){
      this.reserverCar(0, 0, 0);
    } 
  }

  slidePrev(slideView) {
    this.currentStep -= 1;
    this.reserve.lockSwipes(false);
    this.steps = (this.steps - 0.33) < 0  ? 0 : this.steps - 0.33;
    slideView.slidePrev(500);
    this.reserve.lockSwipes(true);
  }

  async onSubmit(form: NgForm) {
    const { source , error} = await this.stripe.createSource(this.card);
    if (error){
      const cardError = error.message;
    } else {
      this.load.presentLoading();
      const resp = await this.db.checkout(source, this.days * this.data['pricePerDay'], this.glb.user.email);
      if (resp['status'] === 'success'){
        this.load.dismissLoading();
        this.reserverCar(1, resp['data']['id'], resp['data']['source']['id']);
      } else {
        //TODO checkout fail // inform user
        this.load.dismissLoading();
      } 
    }

  }

  onClick() {
    console.log(this.data);
  }

}
