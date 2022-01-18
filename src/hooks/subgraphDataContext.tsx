import React, { ReactElement, useContext } from "react";
import { AugmentedAuctionData, AugmentedBidData} from "../models/auction";
import useFetchSubgraphData from "./useFetchSubgraphData";

export type SubgraphDataContextType = {
  responses: {
    auctions: AugmentedAuctionData[];
    bids: AugmentedBidData[]
  };
  loading: boolean;
};

export const defaultSubgraphData = {
  responses: {
    auctions: [],
    bids: []
  },
  loading: true,
};

export const SubgraphDataContext =
  React.createContext<SubgraphDataContextType>(defaultSubgraphData);

export const SubgraphDataContextProvider: React.FC<{ children: ReactElement }> =
  ({ children }) => {
    const subgraphData = useFetchSubgraphData();

    return (
      <SubgraphDataContext.Provider value={subgraphData}>
        {children}
      </SubgraphDataContext.Provider>
    );
  };

  export const useAuctionsData = (auctionId: string) => {
    const contextData = useContext(SubgraphDataContext);

    const auctionInformation = contextData.responses.auctions.filter((value) => {
        return value.id == auctionId
      })
  
    return {
      data: auctionInformation,
      loading: contextData.loading,
    };
  };

  export const useBidsData = (auctionId: string) => {
    const contextData = useContext(SubgraphDataContext);

    const bids = contextData.responses.bids.filter((value) => {
        return value.auction == auctionId
      })
  
    return {
      data: bids,
      loading: contextData.loading,
    };
  };
