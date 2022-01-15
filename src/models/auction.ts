import { BigNumber } from "ethers";
import {
  AuctionList,
  AuctionOptions,
} from "../constants/constants";

export type AuctionData = {
  id: string,
  bidding: {
    id: string,
    address: string,
    name: string,
    symbol: string,
    decimals: Number,
  },
  option: {
    id: string,
    address: string,
    name: string,
    symbol: string,
    decimals: string,
    expiry: string,
    strike: string,
    underlying: {
      id: string,
      address: string,
      name: string,
      symbol: string,
      decimals: Number,
    },
    put: Boolean,
  },
  minimum: string,
  size: string,
  start: string,
  end: string,
  bids: Number,
  filled: string,
  clearing: string,
  spot: Number,
  live: Boolean
}

export type BidData = {
  id: string,
  index: string,
  auction: string,
  size: string,
  payable: string,
  live: string,
  claimed: string,
  hash: string,
  bytes: string,
}

export interface AugmentedAuctionData extends AuctionData {
  chainId: Number,
}

export interface AugmentedBidData extends BidData {
  chainId: Number,
}

export interface VaultData {
  responses: VaultDataResponses;
  loading: boolean;
}

export type VaultDataResponses = {
  [vault in AuctionOptions]: VaultDataResponse;
}

export type VaultDataResponse = {
  totalBalance: BigNumber,
  queuedWithdrawShares: BigNumber,
  pricePerShare: BigNumber,
  estimatedSize: BigNumber,
}

export const defaultVaultData: VaultData = {
  responses: Object.fromEntries(
    AuctionList.map((auction) => [
      auction,
      {
        totalBalance: BigNumber.from(0),
        queuedWithdrawShares: BigNumber.from(0),
        pricePerShare: BigNumber.from(0),
        estimatedSize: BigNumber.from(0),
      },
    ])
  ) as VaultDataResponses,
  loading: true,
};