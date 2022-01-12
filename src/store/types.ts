import { BigNumber } from "ethers"

export const AssetsList = [
  "AAVE",
  "WAVAX",
  "WETH",
  "USDC",
  "WBTC",
  "stETH",
  "yvUSDC",
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
);

export type AirdropInfoData = {
  account: string;
  total: number;
  proof: {
    index: number;
    amount: BigNumber;
    proof: string[];
  };
  breakdown: {
    [key: string]: number;
  };
  claimed: boolean;
};
