import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { CHAINID, isDevelopment, supportedChainIds } from "./env";

export const injectedConnector = new InjectedConnector({
  supportedChainIds,
});


export const getWalletConnectConnector = () =>
  new WalletConnectConnector({
    supportedChainIds,
    rpc: isDevelopment()
      ?
        {
          [CHAINID.ETH_KOVAN]: process.env.REACT_APP_TESTNET_URI || "",
          [CHAINID.AVAX_FUJI]: process.env.REACT_APP_FUJI_URI || "",
        }
      :
        {
          [CHAINID.ETH_MAINNET]: process.env.REACT_APP_MAINNET_URI || "",
          [CHAINID.AVAX_MAINNET]: process.env.REACT_APP_AVAX_URI || ""
        },
    qrcode: true,
    pollingInterval: 5000,
  });

export const walletlinkConnector = new WalletLinkConnector({
  url: (isDevelopment()
    ? process.env.REACT_APP_TESTNET_URI
    : process.env.REACT_APP_MAINNET_URI)!,
  appName: "Ribbon Finance",
  supportedChainIds,
});
