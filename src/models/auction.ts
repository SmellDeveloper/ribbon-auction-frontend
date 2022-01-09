import { BigNumber } from "ethers";
import {
  AuctionList,
  AuctionOptions,
} from "../constants/constants";

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