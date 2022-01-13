import React, { ReactElement, useContext } from "react";
import { defaultVaultData, VaultData } from "../models/auction"
import useFetchVaultData from "./fetchVaultData";
import useFetchAssetBalanceData, {
  defaultUserAssetBalanceData,
  UserAssetBalanceData,
} from "./useFetchAssetBalanceData";

export type Web3DataContextType = {
  sizes: VaultData;
  balances: UserAssetBalanceData
};

export const Web3DataContext = React.createContext<Web3DataContextType>({
  sizes: defaultVaultData,
  balances: defaultUserAssetBalanceData,
});

export const useEstimatedSizes = () => {
  const contextData = useContext(Web3DataContext);

  return {
    data: contextData.sizes.responses,
    loading: contextData.sizes.loading
  };
};

export const useUserBalance = () => {
  const contextData = useContext(Web3DataContext);

  return {
    data: contextData.balances.data,
    loading: contextData.balances.loading
  };
};

export const Web3DataContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const vaultData = useFetchVaultData();
  const assetBalance = useFetchAssetBalanceData();

  return (
    <Web3DataContext.Provider
      value={{
        sizes: vaultData,
        balances: assetBalance  
      }}
    >
      {children}
    </Web3DataContext.Provider>
  );
};
