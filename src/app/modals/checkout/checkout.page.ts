import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { GlobalsService } from '../../services/globals.service';
import { DbinteractionsService } from '../../services/dbinteractions.service';

//declare var Stripe: stripe.StripeStatic;
  

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})

export class CheckoutPage implements OnInit {


  constructor(
    private functions : AngularFireFunctions,
    private glb : GlobalsService,
    private db : DbinteractionsService) { }

  @Input() amount: number;
  @Input() description: String;
  @ViewChild('cardElement', {static: true}) cardElement: ElementRef;

  stripe;
  card;
  cardErrors;

  loading = false;
  confirmation;

  ngOnInit() {
    //this.stripe = Stripe('pk_test_UPMx010YZH8WXjU3c80hBcnf002I0ErB80');
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount(this.cardElement.nativeElement);
    this.card.addEventListener('change', ({error}) => { 
      this.cardErrors = error && error.message;
    });
  }

  async handleForm(e){
    e.preventDefault();

    const { source , error} = await this.stripe.createSource(this.card);
    if (error){
      const cardError = error.message;
    } else {
      const resp = this.db.checkout(source, 1, 2);
      console.log(resp);
      console.log(source);
    }
  }
}


