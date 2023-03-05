import { BigNumber, ethers } from "ethers";

import * as library from "./lib"
import { SponsoredCallERC2771Request, SponsoredCallERC2771Struct, UserAuthSignature } from "./lib/signDataERC2771/types";
import { ApiKey, RelayRequestOptions, RelayResponse } from "./lib/types";

export {
  RelayRequestOptions
};
export class GelatoRelay {

  signDataERC2771 = (
    request: SponsoredCallERC2771Request,
    provider: ethers.providers.Web3Provider,
    sponsorApiKey: string,
    options?: RelayRequestOptions
  ): Promise<SponsoredCallERC2771Struct &
  RelayRequestOptions &
  UserAuthSignature &
  ApiKey> =>
    library.relaySignDataERC2771(
      request,
      provider,
      sponsorApiKey,
      options
    );



}
