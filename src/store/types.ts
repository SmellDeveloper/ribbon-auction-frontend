import { BigNumber } from "ethers"

export const AssetsList = [
  "AAVE",
  "WAVAX",
  "WETH",
  "USDC",
  "WBTC",
  "stETH",
  "yvUSDC",
  "wstETH"
] as const;
export type Assets = typeof AssetsList[number];

export type PendingTransaction = {
  txhash: string;
  status?: "success" | "error";
} & (
  | {
      type: "withdraw" | "withdrawInitiation" | "approval" | "migrate";
      amount: string;
    }
  | {
      type: "deposit";
      amount: string;
      asset: Assets;
    }
  | {
      type: "claim";
      amount: string;
    }
  | {
      type: "stakingApproval";
      amount: string;
    }
  | {
      type: "stake" | "unstake";
      amount: string;
    }
  | {
      type: "rewardClaim";
      amount: string;
    }
  | {
      type: "transfer";
      amount: string;
    }
  | {}
);