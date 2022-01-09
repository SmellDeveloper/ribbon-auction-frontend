import React, { ReactElement } from "react";

import { Assets, AssetsList } from "../utils/asset";
import { useFetchAssetsPrice } from "./fetchAssetPrice";

export type AssetsPriceData = {
  [asset in Assets]: {
    latestPrice: number;
    history: { [timestamp: number]: number };
  };
};

export type ExternalAPIDataContextType = {
  assetsPrice: { data: AssetsPriceData; loading: boolean };
};

export const defaultAssetsPriceData = Object.fromEntries(
  AssetsList.map((asset) => [asset, { latestPrice: 0, history: {} }])
) as AssetsPriceData;


export const defaultExternalAPIData: ExternalAPIDataContextType = {
  assetsPrice: { data: defaultAssetsPriceData, loading: true },
};

export const ExternalAPIDataContext =
  React.createContext<ExternalAPIDataContextType>(defaultExternalAPIData);

export const ExternalAPIDataContextProvider: React.FC<{
  children: ReactElement;
}> = ({ children }) => {
  const assetsPrice = useFetchAssetsPrice();

  return (
    <ExternalAPIDataContext.Provider
      value={{
        assetsPrice,
      }}
    >
      {children}
    </ExternalAPIDataContext.Provider>
  );
};
