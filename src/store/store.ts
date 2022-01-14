import { createGlobalState } from "react-hooks-global-state";
import { AuctionOptions } from "../constants/constants";
import { PendingTransaction, AirdropInfoData, Assets } from "./types";

interface GlobalStore {
  pendingTransactions: PendingTransaction[];
  showConnectWallet: boolean;
  gasPrice: string;
}

export const initialState: GlobalStore = {
  pendingTransactions: [],
  showConnectWallet: false,
  gasPrice: "",
};

interface BidGlobalStore {
  bidActionForm: {
    auctionId: string;
    quantity: string;
    price: string;
    payable: string;
    asset?: Assets;
    lastAction: string;
    prevAction?: string,
  };
}

export const initialBidActionForm = {
  auctionId: "",
  quantity: "",
  price: "",
  payable: "",
  asset: undefined,
  lastAction: "",
  prevAction: "",
};

export const initialFormState: BidGlobalStore = {
  bidActionForm: initialBidActionForm,
};

export const { useGlobalState: useWebappGlobalState } =
  createGlobalState(initialFormState);

export const { useGlobalState } = createGlobalState(initialState);
