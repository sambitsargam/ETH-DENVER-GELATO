import { Injectable, Inject, PLATFORM_ID } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Web3Storage} from 'web3.storage'

import { NFTStorage, File,toGatewayURL } from 'nft.storage';
import { getType } from 'mime';

const WEB3_STORAGE_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY4NGEzRDUxNGE4ZjgzN0Q3NDkxZTlFZDUwNjJjNzg3YkFlRkQ1NDIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDk0MzQ5NDY4MzcsIm5hbWUiOiJjbGlja1RvRGFvIn0.E9yLGpgtYb05VSNVgrUeFc5a_BP5uf_2THChjlIf73g";
const NFT_STORAGE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEU3ZjkyOWE2QzZkRDJkQTI5NmUyQmI2NENCNjlBMTIwQzlDNjJEODAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0OTQzNTI0MjIzNSwibmFtZSI6ImNsaWNrVG9EYW8ifQ.mx1vdaE-4wMbB4NBHTgCc56nhtkw6fmoRTxzu1x26lI";


@Injectable()
export class IpfsService {
  storage: Web3Storage;


  constructor(private http: HttpClient) {

    this.storage = new Web3Storage({ token:WEB3_STORAGE_KEY})



  }

    /**************************************************************************
   * NFT UPLOADS
   *************************************************************************/

    async storeNFT(payload: {
      name: string;
      description: string;
      image: string;
      pathname: string;
    }) {
      // load the file from disk
  
      const type = getType(payload.pathname) as string;
  
      console.log(type);
  
      const myFile = new File([payload.image], 'image.png', { type });
  
      // create a new NFTStorage client using our API key
      const nftstorage = new NFTStorage({ token: NFT_STORAGE_TOKEN });
      const buf = Buffer.from(payload.image);
      const de_buffer = Buffer.from(buf);
      const blob = new Blob([de_buffer]);
      // call client.store, passing in the image & metadata
      const result = await nftstorage.store({
        image: myFile,
        name: payload.name,
        description: payload.description,
      });
      console.log(result);
    }
  
    async retrieveNft(url:string) {
  
      const result = toGatewayURL(url)
    }
  

  /**************************************************************************
   * General UPLOADS
   *************************************************************************/

  async addFile(myFile:File){

    const cid = await this.storage.put([myFile])

    
  
     console.log(cid)
     return cid
    }

}
