// eslint-disable-next-line import/no-named-as-default
import  { BigNumber, providers } from "ethers";
import { getAddress } from "ethers/lib/utils";

import {
  getEIP712Domain,
  populateOptionalUserParameters,
  signTypedDataV4,
} from "../../utils";
import { isNetworkSupported } from "../network";
import {
  ApiKey,
  EIP712_DOMAIN_TYPE_DATA,
  RelayCall,
  RelayRequestOptions,
  RelayResponse,
} from "../types";

import {
  EIP712_SPONSORED_CALL_ERC2771_TYPE_DATA,
  SponsoredCallERC2771PayloadToSign,
  SponsoredCallERC2771Request,
  SponsoredCallERC2771RequestOptionalParameters,
  SponsoredCallERC2771Struct,
  UserAuthSignature,
} from "./types";

export const relaySignDataERC2771 = async (
  request: SponsoredCallERC2771Request,
  provider: providers.Web3Provider,
  sponsorApiKey: string,
  options?: RelayRequestOptions
): Promise<SponsoredCallERC2771Struct &
RelayRequestOptions &
UserAuthSignature &
ApiKey> => {
  return await signDataERC2771(request, provider, sponsorApiKey, options);
};

const getPayloadToSign = (
  struct: SponsoredCallERC2771Struct
): SponsoredCallERC2771PayloadToSign => {
  const domain = getEIP712Domain(struct.chainId as number);
  return {
    domain,
    types: {
      ...EIP712_SPONSORED_CALL_ERC2771_TYPE_DATA,
      ...EIP712_DOMAIN_TYPE_DATA,
    },
    primaryType: "SponsoredCallERC2771",
    message: struct,
  };
};

const mapRequestToStruct = async (
  request: SponsoredCallERC2771Request,
  override: Partial<SponsoredCallERC2771RequestOptionalParameters>
): Promise<SponsoredCallERC2771Struct> => {
  if (!override.userNonce && !request.userNonce) {
    throw new Error(`userNonce is not found in the request, nor fetched`);
  }
  if (!override.userDeadline && !request.userDeadline) {
    throw new Error(`userDeadline is not found in the request, nor fetched`);
  }
  return {
    userNonce:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      override.userNonce ?? BigNumber.from(request.userNonce!).toString(),
    userDeadline:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      override.userDeadline ?? BigNumber.from(request.userDeadline!).toString(),
    chainId: BigNumber.from(request.chainId).toString(),
    target: getAddress(request.target as string),
    data: request.data,
    user: getAddress(request.user as string),
  };
};

const signDataERC2771 = async (
  request: SponsoredCallERC2771Request,
  provider: providers.Web3Provider,
  sponsorApiKey: string,
  options?: RelayRequestOptions
): Promise<SponsoredCallERC2771Struct &
RelayRequestOptions &
UserAuthSignature &
ApiKey> => {
  try {
  
    const parametersToOverride = await populateOptionalUserParameters<
      SponsoredCallERC2771Request,
      SponsoredCallERC2771RequestOptionalParameters
    >(request, provider);
    const struct = await mapRequestToStruct(request, parametersToOverride);
    const signature = await signTypedDataV4(
      provider,
      request.user as string,
      JSON.stringify(getPayloadToSign(struct))
    );
    const signedRequest =  {
      ...struct,
      ...options,
      userSignature: signature,
      sponsorApiKey,
    };
    return signedRequest;
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/sponsoredCallERC2771: Failed with error: ${errorMessage}`
    );
  }
};
