import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GaslessMintingModule } from './gasless-minting/gasless-minting.module';
import { DappInjectorModule } from './dapp-injector/dapp-injector.module';
import { StoreModule } from '@ngrx/store';
import { we3ReducerFunction } from 'angular-web3';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { AppFooterComponent } from './shared/components/footer/app.footer.component';
import { AppTopBarComponent } from './shared/components/toolbar/app.topbar.component';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PaymentService } from './shared/services/payment';
import { SharedService } from './shared/services/postboot.service';
import { IpfsService } from './shared/services/ipfs.service';


@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    AppTopBarComponent,
    AppFooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    GaslessMintingModule,
    DappInjectorModule.forRoot({wallet:'wallet', defaultNetwork:'mumbai'}),
    StoreModule.forRoot({web3: we3ReducerFunction}),
    DropdownModule,
    ProgressSpinnerModule,
    ButtonModule,
    ToastModule,
    ButtonModule,
    ClipboardModule,
  ],
  providers: [MessageService,PaymentService,SharedService,IpfsService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
