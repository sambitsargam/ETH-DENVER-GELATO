import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AngularContract,
  DappInjector,
  no_network,
  angular_web3,
  DappBaseComponent,
  netWorkById,
  Web3Actions,
} from 'angular-web3';
import { Contract, ethers, providers } from 'ethers';
import { GaslessMinting } from 'src/assets/contracts/interfaces/GaslessMinting';
import { GiphyFetch } from '@giphy/js-fetch-api';
//import {  CallWithSyncFeeRequest,GelatoRelay,SponsoredCallERC2771Request } from '@gelatonetwork/relay-sdk';
import { PaymentService } from 'src/app/shared/services/payment';
import { DOCUMENT } from '@angular/common';

import { GelatoRelay } from 'src/app/realy-sdk';
import { SharedService } from 'src/app/shared/services/postboot.service';
import { firstValueFrom, pipe } from 'rxjs';
import GaslessMintingMetadata from 'src/assets/contracts/gasless-minting_metadata.json';

import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { DomSanitizer } from '@angular/platform-browser';
import { IpfsService } from 'src/app/shared/services/ipfs.service';
import { Web3Auth, Web3AuthOptions } from '@web3auth/modal';
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import {
  GaslessOnboarding,
  GaslessWalletConfig,
  GaslessWalletInterface,
  LoginConfig,
} from '@gelatonetwork/gasless-onboarding';

import { GaslessWallet } from '@gelatonetwork/gasless-wallet';

import { Server } from 'http';
import { Router, UrlTree } from '@angular/router';

const relay = new GelatoRelay();
// const openloginAdapter = new OpenloginAdapter(OpenloginAdapterOptions);
declare var Stripe: any;

@Component({
  selector: 'gasless-minting',
  templateUrl: './gasless-minting.component.html',
  styles: [
    `
      .blockchain_is_busy {
        animation: spinHorizontal 2s infinite linear;
        filter: hue-rotate(220deg);
      }
      @keyframes spinHorizontal {
        0% {
          transform: rotate(0deg);
        }
        50% {
          transform: rotate(360deg);
        }
        100% {
          transform: rotate(0deg);
        }
      }
    `,
  ],
})
export class GaslessMintingComponent
  extends DappBaseComponent
  implements AfterViewInit
{
  paymentRequest: any;
  elements: any;
  card: any;
  stripe: any;
  gaslessMinting!: GaslessMinting;
  toKenId!: string;
  textt!: string;
  show_success = false;
  randGif!: number;
  web3auth!: Web3Auth;
  gifUrl!: any;
  provider: ethers.providers.Web3Provider | null = null;
  gaslessOnboarding!: GaslessOnboarding;
  gelatoSmartWallet!: GaslessWallet;
  isDeployed!: boolean;
  web3authProvider: any;
  gaslessWalletConfig!: { apiKey: string };
  gelatoWalletAddress!:string;
  eoa!:string;
  user!:string;

  constructor(
    store: Store,
    dapp: DappInjector,
    public pmt: PaymentService,
    public shared: SharedService,
    public ipfsService: IpfsService,
    public router:Router,
    @Inject(DOCUMENT) private readonly document: any
  ) {
    super(dapp, store);
  }

  async getTokenId() {
    this.toKenId = (await this.gaslessMinting._tokenIds()).toString();
  }
  async generateGif(name: string): Promise<string> {
    const apiKey = "VbCWDX4a30awTm4DMUT6Xy56VDZ0CBwG";
    const giphyFetch = new GiphyFetch(apiKey);

    // Search for a GIF of the name using the SDK
    const { data } = await giphyFetch.search(name, { limit: 1 });
  
    // Extract the GIF URL from the response
    const gifUrl = data[0].images.original.url;
  
    // Return the GIF URL
    return gifUrl;
    
  }
  async aaMint(text: any) {
    if (this.provider == null) {
      alert('please sign in');
      return;
    }
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    this.store.dispatch(
      Web3Actions.chainBusyWithMessage({
        message: { body: `Preparing the transaction`, header: 'Waiting..' },
      })
    ); 

// Set your GIPHY API key
const apiKey = "VbCWDX4a30awTm4DMUT6Xy56VDZ0CBwG";

// Define an async function to generate a GIF of a name input
async function generateGif(name: string): Promise<string> {
  // Search for a GIF of the name using the SDK
  const { data } = await giphyFetch.search(name, { limit: 1 });

  // Extract the GIF URL from the response
  const gifUrl = data[0].images.original.url;

  // Return the GIF URL
  return gifUrl;
}

// Create a new instance of the GiphyFetch SDK
const giphyFetch = new GiphyFetch(apiKey);
const gifUrl = await generateGif(text);
console.log(gifUrl)

  
    const metadata = {
      description: 'Random Name Gelato Gasless NFT',
      external_url: 'https://openseacreatures.io/3',
      image: `${gifUrl}`,
      name: `#${+this.toKenId + 1} Random Name Gasless NFT`,
      attributes: [
        { value: 'Gasless' },
        { value: 'Fiat Payed' },
      ],
    };

    const blob = new Blob([JSON.stringify(metadata)], {
      type: 'application/json',
    });
    const file = new File([blob], 'metadata.json');
    this.store.dispatch(
      Web3Actions.chainBusyWithMessage({
        message: {
          body: `Please wait till IPFS finish the process`,
          header: 'Uploading to IPFS..',
        },
      })
    );
    try {
      let cid = await this.ipfsService.addFile(file);
      let url = `https://ipfs.io/ipfs/${cid}/metadata.json`;

      const { data } = await this.gaslessMinting.populateTransaction.aaMint(
        url
      );

    let tx = await this.gelatoSmartWallet.sponsorTransaction(
      this.gaslessMinting.address,
      data!
    );

    


    } catch(error) {
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      alert('Something went wrong sorry');
      console.log(error);
    
    }
  }

  /// Web3auth Connect
  async connect() {
    this.gaslessWalletConfig = {

      apiKey: 'lH8yqx72APAHXvLQ7xbi88i3ap7TgUSb8g26hY_Jy4g_',
    };
    const loginConfig: LoginConfig = {
      domains: [window.location.origin],
      chain: {
        id: 80001,//5,
        rpcUrl: 'https://rpc-mumbai.maticvigil.com/', //"https://polygon-mumbai.g.alchemy.com/v2/P2lEQkjFdNjdN0M_mpZKB8r3fAa2M0vT",//
      },
      ui: {
        theme: 'dark',
      },
      openLogin: {
        redirectUrl: `${window.location.origin}/login`,
      },
    };
    this.gaslessOnboarding = new GaslessOnboarding(
      loginConfig,
      this.gaslessWalletConfig
    );

    await this.gaslessOnboarding.init();

    this.web3authProvider = await this.gaslessOnboarding.login();

    this.gelatoSmartWallet = await this.gaslessOnboarding.getGaslessWallet()

    const user = await this.gaslessOnboarding.getUserInfo();

    this.user = user.email!;

    this.provider = new providers.Web3Provider(this.web3authProvider);

    this.eoa= (await this.provider!.listAccounts())[0];

      this.gelatoWalletAddress = this.gelatoSmartWallet.getAddress()!

    this.gaslessMinting = new Contract(
      GaslessMintingMetadata.address,
      GaslessMintingMetadata.abi,
      this.provider!
    ) as GaslessMinting;
    this.gaslessMinting.on('Transfer', async () => {
      await this.getTokenId();
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      this.show_success = true;
    });
    await this.getTokenId();
  }


  async getMetadata(text: any) {
    if (this.provider == null) {
      alert('please sign in');
      return false;
    }
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    this.store.dispatch(
      Web3Actions.chainBusyWithMessage({
        message: { body: `Preparing the transaction`, header: 'Waiting..' },
      })
    );
  
    
// Set your GIPHY API key
const apiKey = "VbCWDX4a30awTm4DMUT6Xy56VDZ0CBwG";

// Define an async function to generate a GIF of a name input
async function generateGif(name: string): Promise<string> {
  // Search for a GIF of the name using the SDK
  const { data } = await giphyFetch.search(name, { limit: 1 });

  // Extract the GIF URL from the response
  const gifUrl = data[0].images.original.url;

  // Return the GIF URL
  return gifUrl;
}

// Create a new instance of the GiphyFetch SDK
const giphyFetch = new GiphyFetch(apiKey);
const gifUrl = await generateGif(text);
console.log(gifUrl)


    const metadata = {
      description: 'Random Name Gelato Gasless NFT',
      external_url: 'https://openseacreatures.io/3',
      image: `${gifUrl}`,
      name: `#${+this.toKenId + 1} Random Name Gasless NFT`,
      attributes: [
        { value: 'Gasless' },
        { value: 'Fiat Payed' },
      ],
    };

    const blob = new Blob([JSON.stringify(metadata)], {
      type: 'application/json',
    });
    const file = new File([blob], 'metadata.json');
    this.store.dispatch(
      Web3Actions.chainBusyWithMessage({
        message: {
          body: `Please wait till IPFS finish the process`,
          header: 'Uploading to IPFS.... It may Takes 30 seconds',
        },
      })
    );
    try {
      let cid = await this.ipfsService.addFile(file);
      let url = `https://ipfs.io/ipfs/${cid}/metadata.json`;

      const { data } = await this.gaslessMinting.populateTransaction.aaMint(
        url
      );

      let object: { web3authProvider:any, gaslessWalletConfig:any, target:any, data:any} = {
        data,
        target: this.gaslessMinting.address,
        gaslessWalletConfig: this.gaslessWalletConfig,
        web3authProvider: this.web3authProvider,
      };
      return object
    } catch (error) {
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      alert('Something went wrong sorry');
      console.log(error);
      return false;
    }
  }

  /// IPFS and Signing request
  async getSignedRequest( text: any) {
    if (this.provider == null) {
      alert('please sign in');
      return false;
    }

    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    this.store.dispatch(
      Web3Actions.chainBusyWithMessage({
        message: { body: `Preparing the transaction`, header: 'Waiting..' },
      })
    );
    
// Set your GIPHY API key
const apiKey = "VbCWDX4a30awTm4DMUT6Xy56VDZ0CBwG";

// Define an async function to generate a GIF of a name input
async function generateGif(name: string): Promise<string> {
  // Search for a GIF of the name using the SDK
  const { data } = await giphyFetch.search(name, { limit: 1 });

  // Extract the GIF URL from the response
  const gifUrl = data[0].images.original.url;

  // Return the GIF URL
  return gifUrl;
}

// Create a new instance of the GiphyFetch SDK
const giphyFetch = new GiphyFetch(apiKey);
const gifUrl = await generateGif(text);

    const metadata = {
      description: 'Random Name Gelato Gasless NFT',
      external_url: 'https://openseacreatures.io/3',
      image: `${gifUrl}`,
      name: `#${+this.toKenId + 1} Random Name Gasless NFT`,
      attributes: [
        { value: 'Gasless' },
        { value: 'Fiat Payed' },
      ],
    };

    const blob = new Blob([JSON.stringify(metadata)], {
      type: 'application/json',
    });
    const file = new File([blob], 'metadata.json');
    this.store.dispatch(
      Web3Actions.chainBusyWithMessage({
        message: {
          body: `Please wait till IPFS finish the process`,
          header: 'Uploading to IPFS..',
        },
      })
    );
    try {
      let cid = await this.ipfsService.addFile(file);
      let url = `https://ipfs.io/ipfs/${cid}/metadata.json`;

      const { data } = await this.gaslessMinting.populateTransaction.aaMint(
        url
      );

      const tx = await this.gelatoSmartWallet.populateSponsorTransaction(
        this.gaslessMinting.address,
        data!
      );


      const address = (await this.provider.listAccounts())[0];
      const request = {
        chainId: 80001, // Goerli in this case
        target: this.gelatoWalletAddress, // target contract address
        data: tx.data!, // encoded transaction datas
        user: address, //user sending the trasnaction
      };
      const sponsorApiKey = 'lH8yqx72APAHXvLQ7xbi88i3ap7TgUSb8g26hY_Jy4g_';
      this.store.dispatch(
        Web3Actions.chainBusyWithMessage({
          message: { body: `Waiting For Signature.`, header: `Please sign` },
        })
      );

      let signnedRequest = await relay.signDataERC2771(
        request,
        this.provider,
        sponsorApiKey
      );
      return signnedRequest;
    } catch (error) {
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      alert('Something went wrong sorry');
      console.log(error);
      return false;
    }
  }




  private loadScript() {
    // this.stripeLoaded = false;
    const script = this.document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.crossorigin = true;
    script.src = 'https://js.stripe.com/v3/';
    script.onload = () => {
      this.init();
    };

    this.document.body.appendChild(script);
  }
  override async hookContractConnected(): Promise<void> {
    let signer = this.dapp.signer!;
  }

 async reconnect() {
  this.store.dispatch(Web3Actions.chainBusy({ status: true }));
  await this.connect();
  this.store.dispatch(Web3Actions.chainBusy({ status: false }));

 }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();

     let url = window.location.origin;

    if (this.router.url.indexOf('/login')!=-1){
      console.log('connecting...')
      this.reconnect();
          }

    this.loadScript();
  }

  close() {
    this.show_success = false;
    this.randGif = 0;
  }

  init() {
    this.stripe = Stripe('pk_test_98apj66XNg5rUu7i0Hzq5W1y00wYq5kIbY');

    this.elements = this.stripe.elements();

    var style = {
      base: {
        color: '#32325d',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
        ':-webkit-autofill': {
          color: '#32325d',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
        ':-webkit-autofill': {
          color: '#fa755a',
        },
      },
    };

    // Create an instance of the card Element.
    this.card = this.elements.create('card', { style: style });
  
    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
  }

  async signOut() {
    await this.gaslessOnboarding.logout();
    this.provider = null;
    this.eoa = '';
    this.gelatoWalletAddress = '';
    this.user = '';

  }
}
