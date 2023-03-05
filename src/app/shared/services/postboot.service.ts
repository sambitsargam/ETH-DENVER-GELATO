import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, ReplaySubject, BehaviorSubject, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// import { environment } from '../../../environments/environment';
// import { PaymentPayload, PaymentType, Reservation, PayloadType, IREVIEW_SURVEY } from '@nx-day-spa/models';;


@Injectable()
export class SharedService {


  constructor(private http: HttpClient) {

 


  }

  paymentPaypal(request:any):Observable<any> {
    //let url = environment.stripeIntent

    const body = {data:request}
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post('https://us-central1-gelato-gasless-nft.cloudfunctions.net/paypalCreateFunction', body, httpOptions);
    
  
  }
  
  paymentStripeAAIntent(request:any ):Observable<any> {
    //let url = environment.stripeIntent

    const body = {data:request}
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post('https://us-central1-gelato-gasless-nft.cloudfunctions.net/stripeAAIntentFunction', body, httpOptions);
    
  }

  paymentStripeIntent(request:any ):Observable<any> {
    //let url = environment.stripeIntent

    const body = {data:request}
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post('https://us-central1-gelato-gasless-nft.cloudfunctions.net/stripeIntentFunction', body, httpOptions);
    
  }

}
