import React, { ReactElement } from "react";
import { AuctionData } from "../models/auction";
// import {
//   ERC20TokenAccountSubgraphData,
//   ERC20TokenSubgraphData,
// } from "../models/token";

// import {
//   BalanceUpdate,
//   defaultV2VaultPriceHistoriesData,
//   defaultVaultAccountsData,
//   defaultVaultActivitiesData,
//   VaultPriceHistoriesData,
//   VaultAccountsData,
//   VaultActivitiesData,
//   VaultTransaction,
// } from "../models/vault";
import useFetchSubgraphData from "./useFetchSubgraphData";

export type SubgraphDataContextType = {
  responses: AuctionData[];
  loading: boolean;
};

export const defaultSubgraphData = {
  responses: [],
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
