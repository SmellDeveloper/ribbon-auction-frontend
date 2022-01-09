import { createGlobalState } from "react-hooks-global-state";
import { PendingTransaction, AirdropInfoData } from "./types";

interface GlobalStore {
  pendingTransactions: PendingTransaction[];
  showConnectWallet: boolean;

  gasPrice: string;
  airdropInfo: AirdropInfoData | undefined;
  notificationLastReadTimestamp?: number;
}

export const initialState: GlobalStore = {
  pendingTransactions: [],
  showConnectWallet: false,
  gasPrice: "",
  airdropInfo: undefined,
  notificationLastReadTimestamp: undefined,
};

export const { useGlobalState } = createGlobalState(initialState);
