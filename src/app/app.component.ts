import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DappBaseComponent } from 'angular-web3';
import { PrimeNGConfig } from 'primeng/api';
import { DappInjector } from './dapp-injector/dapp-injector.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends DappBaseComponent {
  title = 'gasless-nft';
  constructor(private primengConfig: PrimeNGConfig,
    dapp: DappInjector, store: Store, ){
      super(dapp, store);
    }
  ngOnInit() {
    this.primengConfig.ripple = true;
    document.documentElement.style.fontSize = '16px';
  }
}

