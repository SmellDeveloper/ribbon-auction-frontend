import {
  AuctionAddressMap,
  AuctionOptions,
} from "../constants/constants";

export const isAuctionSupportedOnChain = (
  AuctionOption: AuctionOptions,
  chainId: number
): Boolean => {
  return AuctionAddressMap[AuctionOption].chainId === chainId;
};