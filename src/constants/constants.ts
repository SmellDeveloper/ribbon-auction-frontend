import {
  CHAINID,
  isDevelopment,
} from "../utils/env";
import deployment from "./deployments.json";
import addresses from "./externals.json";
import { Assets } from "../utils/asset"

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

export const NETWORK_ALT_DESCRIPTION: Record<CHAINID, string> = {
  [CHAINID.ETH_MAINNET]: "ETHEREUM MAINNET",
  [CHAINID.ETH_KOVAN]: "KOVAN TESTNET",
  [CHAINID.AVAX_MAINNET]: "AVALANCHE MAINNET",
  [CHAINID.AVAX_FUJI]: "FUJI TESTNET",
};

export const CHAINID_TO_NATIVE_TOKENS: Record<CHAINID, Assets> = {
  [CHAINID.ETH_MAINNET]: "WETH",
  [CHAINID.ETH_KOVAN]: "WETH",
  [CHAINID.AVAX_MAINNET]: "WAVAX",
  [CHAINID.AVAX_FUJI]: "WAVAX",
};

export const isEthNetwork = (chainId: number): boolean =>
  chainId === CHAINID.ETH_MAINNET || chainId === CHAINID.ETH_KOVAN;

export const isAvaxNetwork = (chainId: number): boolean =>
  chainId === CHAINID.AVAX_MAINNET || chainId === CHAINID.AVAX_FUJI;

export const isEthAuction = (vault: string) =>
  isEthNetwork(AuctionAddressMap[vault as AuctionOptions].chainId);

export const isAvaxAuction = (vault: string) =>
  isAvaxNetwork(AuctionAddressMap[vault as AuctionOptions].chainId);

export const NATIVE_TOKENS = ["WETH", "WAVAX"];
export const isNativeToken = (token: string): boolean =>
  NATIVE_TOKENS.includes(token);

export const AuctionList= [
  "WBTC-call",
  "AAVE-call",
  "WETH-put",
  "wstETH-call",
  "WETH-call",
  "WAVAX-call"
] as const;

export type AuctionOptions = typeof AuctionList[number];

export const AuctionAddressMap: {
  [auction in AuctionOptions]: {
    vault: string;
    chainId: number;
  };
} = {
  "WBTC-call": isDevelopment()
    ? {
        vault: deployment.kovan.RibbonThetaVaultWBTCCall,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        vault: deployment.mainnet.RibbonThetaVaultWBTCCall,
        chainId: CHAINID.ETH_MAINNET,
      },
  "AAVE-call": isDevelopment()
    ? {
        vault: deployment.kovan.RibbonThetaVaultAAVECall,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        vault: deployment.mainnet.RibbonThetaVaultAAVECall,
        chainId: CHAINID.ETH_MAINNET,
      },
  "WETH-put": isDevelopment()
    ? {
        vault: deployment.kovan.RibbonThetaVaultETHCall,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        vault: deployment.mainnet.RibbonThetaVaultETHCall,
        chainId: CHAINID.ETH_MAINNET,
      },
  "wstETH-call": isDevelopment()
    ? {
        vault: deployment.kovan.RibbonThetaVaultSTETHCall,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        vault: deployment.mainnet.RibbonThetaVaultSTETHCall,
        chainId: CHAINID.ETH_MAINNET,
      },
  "WETH-call": isDevelopment()
    ? {
        vault: deployment.kovan.RibbonThetaVaultETHCall,
        chainId: CHAINID.ETH_KOVAN,
      }
    : {
        vault: deployment.mainnet.RibbonThetaVaultETHCall,
        chainId: CHAINID.ETH_MAINNET,
      },
  "WAVAX-call": isDevelopment()
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

export const getAssets = (vault: AuctionOptions): Assets => {
  switch (vault) {
    case "WBTC-call":
      return "WBTC";
    case "AAVE-call":
      return "AAVE";
    case "WETH-put":
      return "USDC";
    case "wstETH-call":
      return "WETH";
    case "WETH-call":
      return "WETH";
    case "WAVAX-call":
      return "WAVAX";
  }
};

export const getTokenAddress = (token: Assets, chainId: number) => {
  const network = NETWORKS[chainId];
  return isDevelopment()
    ? (addresses[network].assets as any)[token]
    : (addresses[network].assets as any)[token];
};

export const SUBGRAPHS: CHAINID[] = isDevelopment()
  ? [
      CHAINID.ETH_KOVAN,
      CHAINID.AVAX_FUJI,
    ]
  : [
      CHAINID.ETH_MAINNET,
      CHAINID.AVAX_MAINNET,
    ];

export const getERC20TokenAddress = (token: Assets, chainId: number) => {
  const network = NETWORKS[chainId];
  return isDevelopment()
    ? (addresses[network].assets as any)[token]
    : (addresses[network].assets as any)[token];
};

export const getGnosisAuction = (chainId: number) =>
  GNOSIS_AUCTION[chainId as CHAINID]

export const GNOSIS_AUCTION: Record<number, string> = {
  [CHAINID.ETH_MAINNET]: "0x0b7fFc1f4AD541A4Ed16b40D8c37f0929158D101",
  [CHAINID.ETH_KOVAN]: "0x3D1D40101E185E1fE3aedCF05FE2F5BA0Af1f25D",
  [CHAINID.AVAX_MAINNET]: "0xb5D00F83680ea5E078e911995c64b43Fbfd1eE61",
  [CHAINID.AVAX_FUJI]: "0xb5D00F83680ea5E078e911995c64b43Fbfd1eE61"
};