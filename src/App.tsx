import React from 'react';
import logo from './logo.svg';

import RootApp from "./components/RootApp";
import { Web3ReactProvider } from "@web3-react/core";
import { useEffect } from "react";
import smoothscroll from "smoothscroll-polyfill";
import { Web3ContextProvider } from "./hooks/web3Context";
import { Web3DataContextProvider } from "./hooks/web3DataContext";
import { getLibrary } from "./utils/library";
import { ExternalAPIDataContextProvider } from "./hooks/externalAPIDataContext";

function App() {
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  return (
    <Web3ContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3DataContextProvider>
          <ExternalAPIDataContextProvider>
            <RootApp />
          </ExternalAPIDataContextProvider>
        </Web3DataContextProvider>
      </Web3ReactProvider>
    </Web3ContextProvider>
  );
}

export default App;
