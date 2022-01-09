import React, { ReactElement, useContext } from "react";
import { defaultVaultData, VaultData } from "../models/auction"
import useFetchVaultData from "./fetchVaultData";

export type Web3DataContextType = {
  sizes: VaultData;
};

export const Web3DataContext = React.createContext<Web3DataContextType>({
  sizes: defaultVaultData,
});

export const useEstimatedSizes = () => {
  const contextData = useContext(Web3DataContext);

  return {
    sizes: contextData.sizes
  };
};

export const Web3DataContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const vaultData = useFetchVaultData();

  return (
    <Web3DataContext.Provider
      value={{
        sizes: vaultData
      }}
    >
      {children}
    </Web3DataContext.Provider>
  );
};
