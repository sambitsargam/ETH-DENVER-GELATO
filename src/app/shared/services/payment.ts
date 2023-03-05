import { Injectable } from '@angular/core';
import {loadStripe} from '@stripe/stripe-js';

declare var Stripe: any;

@Injectable()
export class PaymentService {

  public stripe:any;


  constructor( ) {

this.stripeload();
     
  }

  async stripeload(){
    //this.stripe = await loadStripe("pk_test_98apj66XNg5rUu7i0Hzq5W1y00wYq5kIbY");
 
  }

}
