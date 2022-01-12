import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";

// import {
//   getSubgraphURIForVersion,
//   SUBGRAPHS_TO_QUERY,
//   VaultVersion,
//   VaultVersionList,
// } from "../constants/constants";
import {
  defaultSubgraphData,
  SubgraphDataContextType,
} from "./subgraphDataContext";
// import { impersonateAddress } from "../utils/development";
// import {
//   resolveVaultAccountsSubgraphResponse,
//   vaultAccountsGraphql,
// } from "./useAuctionSubgraph";
// import { isProduction } from "../utils/env";
// import {
//   resolveTransactionsSubgraphResponse,
//   transactionsGraphql,
// } from "./useTransactions";
// import {
//   balancesGraphql,
//   resolveBalancesSubgraphResponse,
// } from "./useBalances";
// import {
//   resolveVaultActivitiesSubgraphResponse,
//   vaultActivitiesGraphql,
// } from "./useVaultActivity";
// import {
//   rbnTokenGraphql,
//   resolveRBNTokenAccountSubgraphResponse,
//   resolveRBNTokenSubgraphResponse,
// } from "./useRBNTokenSubgraph";
// import {
//   vaultPriceHistoryGraphql,
//   resolveVaultPriceHistorySubgraphResponse,
// } from "./useVaultPerformanceUpdate";
import { AuctionGraphql } from "./useAuctionSubgraph"
import { usePendingTransactions } from "./pendingTransactionsContext";

const useFetchSubgraphData = () => {
  const { account: account, chainId } = useWeb3React();
  // const account = impersonateAddress || acc;
  const [data, setData] =
    useState<SubgraphDataContextType>(defaultSubgraphData);
  const { transactionsCounter } = usePendingTransactions();
  const [, setMulticallCounter] = useState(0);

  const doMulticall = useCallback(async () => {
    // if (!isProduction()) {
    //   console.time("Subgraph Data Fetch");
    // }

    /**
     * We keep track with counter so to make sure we always only update with the latest info
     */
    let currentCounter: number;
    setMulticallCounter((counter) => {
      currentCounter = counter + 1;
      return currentCounter;
    });

    const allSubgraphResponses = await Promise.all(
      [await axios.post(
        "https://api.thegraph.com/subgraphs/name/stevenwal/gnosis-auction",
        {
          query: `{
              ${AuctionGraphql()}
          }`
        }
      )
      ],
    );

    // // Group all the responses of the same version together
    // // Merge them without overriding the previous properties
    // const responsesAcrossVersions: Record<VaultVersion, any> =
    //   Object.fromEntries(
    //     VaultVersionList.map((version: VaultVersion) => {
    //       const mergedResponse: any = {};

    //       const responsesForVersion = allSubgraphResponses
    //         .filter(([resVersion, _]) => resVersion === version)
    //         .map(([_, res]) => res);

    //       responsesForVersion.forEach((response: any) => {
    //         Object.keys(response).forEach((key: string) => {
    //           // Null state = [] | null
    //           // Non-empty state = [xxx] | {x: 1}
    //           const mergedHasProperty =
    //             mergedResponse[key] ||
    //             (Array.isArray(mergedResponse[key]) &&
    //               mergedResponse[key].length);

    //           if (!mergedHasProperty) {
    //             mergedResponse[key] = response[key];
    //           }
    //         });
    //       });

    //       return [version, mergedResponse];
    //     })
    //   ) as Record<VaultVersion, any>;

    setMulticallCounter((counter) => {
      if (counter === currentCounter) {
        setData((prev) => ({
          ...prev,
          responses: allSubgraphResponses[0].data.data.Auctions,
          loading: false,
        }));
      }

      return counter;
    });

    // if (!isProduction()) {
    //   console.timeEnd("Subgraph Data Fetch");
    // }
  }, [account, chainId]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall, transactionsCounter]);

  return data;
};

export default useFetchSubgraphData;
