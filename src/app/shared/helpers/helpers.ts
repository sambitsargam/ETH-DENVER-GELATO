import { Contract, Signer, utils } from "ethers";
import { abi_ERC20 } from "./abis/erc20";



export const displayAdress= (address: string): string => {
    return (
      address.slice(0, 5) +
      '...' +
      address.slice(address.length - 5, address.length)
    );
  }

  export const isAddress = (address: string) => {
    try {
      utils.getAddress(address);
    } catch (e) {
      return false;
    }
    return true;
  };


  export const blockTimeToTime =(timestamp:number) => {
      let utcTime = new Date(timestamp*1000);
      return utcTime.toLocaleString()

  }

  export const createERC20Instance = (ERC: string, signer: Signer): Contract => {
    return new Contract(ERC, abi_ERC20, signer);
  };
  
  export const randomString = (length:number): string => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890';
    const alphabet_length = alphabet.length - 1;
    let password = "";
    for (let i = 0; i < length; i++) {
      const random_number = Math.floor(Math.random() * alphabet_length) + 1;
      password += alphabet[random_number];
    }
    return password
  }