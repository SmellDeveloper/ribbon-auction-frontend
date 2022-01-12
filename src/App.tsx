import React from 'react';
import logo from './logo.svg';

import RootApp from "./components/RootApp";
import { Web3ReactProvider } from "@web3-react/core";
import { useEffect } from "react";
import smoothscroll from "smoothscroll-polyfill";
import { Web3ContextProvider } from "./hooks/web3Context";
import { Web3DataContextProvider } from "./hooks/web3DataContext";
import { getLibrary } from "./utils/library";
import { SubgraphDataContextProvider } from "./hooks/subgraphDataContext";
import { PendingTransactionsContextProvider } from "./hooks/pendingTransactionsContext";
import { ExternalAPIDataContextProvider } from "./hooks/externalAPIDataContext";

function App() {
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  return (
    <Web3ContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
      <PendingTransactionsContextProvider>
        <Web3DataContextProvider>
          <SubgraphDataContextProvider>
            <ExternalAPIDataContextProvider>
              <RootApp />
            </ExternalAPIDataContextProvider>
          </SubgraphDataContextProvider>
        </Web3DataContextProvider>
      </PendingTransactionsContextProvider>
      </Web3ReactProvider>
    </Web3ContextProvider>
  );
}

export default App;
