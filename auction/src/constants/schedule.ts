import {
  CHAINID,
  SUBGRAPH_URI,
  getSubgraphqlURI,
  isDevelopment,
} from "../utils/env";
import deployment from "./deployments.json";
import addresses from "./externals.json";

export type NETWORK_NAMES = "mainnet" | "kovan" | "fuji" | "avax";

export const NETWORKS: Record<number, NETWORK_NAMES> = {
  [CHAINID.ETH_MAINNET]: "mainnet",
  [CHAINID.ETH_KOVAN]: "kovan",
  [CHAINID.AVAX_FUJI]: "fuji",
  [CHAINID.AVAX_MAINNET]: "avax",
};

export const READABLE_NETWORK_NAMES: Record<CHAINID, string> = {
  [CHAINID.ETH_MAINNET]: "Ethereum",
  [CHAINID.ETH_KOVAN]: "Kovan",
  [CHAINID.AVAX_MAINNET]: "Avalanche",
  [CHAINID.AVAX_FUJI]: "Fuji",
};

export const isEthNetwork = (chainId: number): boolean =>
  chainId === CHAINID.ETH_MAINNET || chainId === CHAINID.ETH_KOVAN;

export const isAvaxNetwork = (chainId: number): boolean =>
  chainId === CHAINID.AVAX_MAINNET || chainId === CHAINID.AVAX_FUJI;

export const isEthAuction = (vault: string) =>
  isEthNetwork(VaultAddressMap[vault as AuctionOptions].chainId);

export const isAvaxAuction = (vault: string) =>
  isAvaxNetwork(VaultAddressMap[vault as AuctionOptions].chainId);

export const AuctionList= [
  "btc-call",
  "aave-call",
  "eth-put",
  "steth-call",
  "eth-call",
  "avax-call"
] as const;

export type AuctionOptions = typeof AuctionList[number];

export const VaultAddressMap: {
  [vault in AuctionOptions]: {
    vault: string;
    chainId: number;
  };
} = {
  "btc-call": isDevelopment()
    ? {
        vault: deployment.kovan.RibbonThetaVaultWBTCCall,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        vault: deployment.mainnet.RibbonThetaVaultWBTCCall,
        chainId: CHAINID.ETH_MAINNET,
      },
  "aave-call": isDevelopment()
    ? {
        vault: deployment.kovan.RibbonThetaVaultAAVECall,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        vault: deployment.mainnet.RibbonThetaVaultAAVECall,
        chainId: CHAINID.ETH_MAINNET,
      },
  "eth-put": isDevelopment()
    ? {
        vault: deployment.kovan.RibbonThetaVaultETHCall,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        vault: deployment.mainnet.RibbonThetaVaultETHCall,
        chainId: CHAINID.ETH_MAINNET,
      },
  "steth-call": isDevelopment()
    ? {
        vault: deployment.kovan.RibbonThetaVaultSTETHCall,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        vault: deployment.mainnet.RibbonThetaVaultSTETHCall,
        chainId: CHAINID.ETH_MAINNET,
      },
  "eth-call": isDevelopment()
    ? {
        vault: deployment.kovan.RibbonThetaVaultETHCall,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        vault: deployment.mainnet.RibbonThetaVaultETHCall,
        chainId: CHAINID.ETH_MAINNET,
      },
  "avax-call": isDevelopment()
    ? {
        vault: deployment.fuji.RibbonThetaVaultAVAXCall,
        chainId: CHAINID.AVAX_FUJI,
      }
    : {
        vault: deployment.avax.RibbonThetaVaultAVAXCall,
        chainId: CHAINID.AVAX_MAINNET,
      },
};

export const BLOCKCHAIN_EXPLORER_NAME: Record<number, string> = {
  [CHAINID.ETH_MAINNET]: "Etherscan",
  [CHAINID.ETH_KOVAN]: "Etherscan",
  [CHAINID.AVAX_MAINNET]: "SnowTrace",
  [CHAINID.AVAX_FUJI]: "SnowTrace",
};

export const BLOCKCHAIN_EXPLORER_URI: Record<number, string> = {
  [CHAINID.ETH_MAINNET]: "https://etherscan.io",
  [CHAINID.ETH_KOVAN]: "https://kovan.etherscan.io",
  [CHAINID.AVAX_MAINNET]: "https://snowtrace.io",
  [CHAINID.AVAX_FUJI]: "https://testnet.snowtrace.io",
};

export const getEtherscanURI = (chainId: number) =>
  BLOCKCHAIN_EXPLORER_URI[chainId as CHAINID];

// export const getSubgraphURIForVersion = (
//   vaultVersion: VaultVersion,
//   chainId: number
// ) => {
//   switch (vaultVersion) {
//     case "v1":
//       return getSubgraphqlURI();
//     case "v2":
//       return SUBGRAPH_URI[chainId];
//   }
// };

export const AssetsList = [
  "AAVE",
  "WAVAX",
  "WETH",
  "USDC",
  "WBTC",
  "stETH",
  "yvUSDC",
  "PERP",
] as const;

export type Assets = typeof AssetsList[number];

export const getAssets = (vault: AuctionOptions): Assets => {
  switch (vault) {
    case "btc-call":
      return "WBTC";
    case "aave-call":
      return "AAVE";
    case "eth-put":
      return "USDC";
    case "steth-call":
      return "WETH";
    case "eth-call":
      return "WETH";
    case "avax-call":
      return "WAVAX";
  }
};

export const getTokenAddress = (token: Assets, chainId: number) => {
  const network = NETWORKS[chainId];
  return isDevelopment()
    ? (addresses[network].assets as any)[token]
    : (addresses[network].assets as any)[token];
};

// export const SUBGRAPHS_TO_QUERY: [VaultVersion, CHAINID][] = isDevelopment()
//   ? [
//       ["v1", CHAINID.ETH_KOVAN],
//       ["v2", CHAINID.ETH_KOVAN],
//       ["v2", CHAINID.AVAX_FUJI],
//     ]
//   : [
//       ["v1", CHAINID.ETH_MAINNET],
//       ["v2", CHAINID.ETH_MAINNET],
//       ["v2", CHAINID.AVAX_MAINNET],
//     ];
