export enum CHAINID {
  ETH_MAINNET = 1,
  ETH_KOVAN = 42,
  AVAX_FUJI = 43113,
  AVAX_MAINNET = 43114,
}

export const SUBGRAPH_URI: Record<number, string> = {
  [CHAINID.ETH_MAINNET]:
    process.env.REACT_APP_MAINNET_SUBGRAPHQL_URL ||
    "https://api.thegraph.com/subgraphs/name/stevenwal/gnosis-auction",
  [CHAINID.ETH_KOVAN]:
    process.env.REACT_APP_KOVAN_SUBGRAPHQL_URL ||
    "https://api.thegraph.com/subgraphs/name/stevenwal/gnosis-auction-kovan",
  [CHAINID.AVAX_FUJI]:
    process.env.REACT_APP_FUJI_SUBGRAPHQL_URL ||
    "https://api.thegraph.com/subgraphs/name/stevenwal/gnosis-auction-avax",
  [CHAINID.AVAX_MAINNET]:
    process.env.REACT_APP_AVAX_SUBGRAPHQL_URL ||
    "https://api.thegraph.com/subgraphs/name/stevenwal/gnosis-auction-avax",
};

export const isDevelopment = () => !isStaging() && !isProduction();

export const isStaging = () =>
  process.env.REACT_APP_VERCEL_GIT_COMMIT_REF === "staging";

export const isProduction = () =>
  process.env.REACT_APP_VERCEL_GIT_COMMIT_REF === "master";

export const NODE_URI: Record<number, string> = {
  [CHAINID.ETH_MAINNET]: process.env.REACT_APP_MAINNET_URI || "",
  [CHAINID.ETH_KOVAN]: process.env.REACT_APP_TESTNET_URI || "",
  [CHAINID.AVAX_MAINNET]: process.env.REACT_APP_AVAX_URI || "",
  [CHAINID.AVAX_FUJI]: process.env.REACT_APP_FUJI_URI || "",
};

export const getSubgraphqlURI = () =>
  (isDevelopment()
    ? process.env.REACT_APP_KOVAN_SUBGRAPHQL_URL
    : process.env.REACT_APP_SUBGRAPHQL_URL) ||
  "https://api.thegraph.com/subgraphs/name/kenchangh/ribbon-finance-kovan";

export const supportedChainIds = isDevelopment()
  ? [CHAINID.ETH_KOVAN, CHAINID.AVAX_FUJI]
  : [CHAINID.ETH_MAINNET, CHAINID.AVAX_MAINNET];

export const ENABLED_CHAINID: CHAINID[] = [
  CHAINID.ETH_MAINNET,
  CHAINID.AVAX_MAINNET,
];

const EtherscanApi = process.env.REACT_APP_ETHERSCAN_API_KEY || "";
const SnowTraceApi = process.env.REACT_APP_SNOWTRACE_API_KEY || "";
export const GAS_URL: Record<number, string> = {
  [CHAINID.ETH_MAINNET]: `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${EtherscanApi}`,
  [CHAINID.ETH_KOVAN]: `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${EtherscanApi}`,
  [CHAINID.AVAX_FUJI]: `https://api.snowtrace.io/api?module=gastracker&action=gasoracle&apikey=${SnowTraceApi}`,
  [CHAINID.AVAX_MAINNET]: `https://api.snowtrace.io/api?module=gastracker&action=gasoracle&apikey=${SnowTraceApi}`,
};
