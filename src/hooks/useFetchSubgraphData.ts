import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";


import {
  defaultSubgraphData,
  SubgraphDataContextType,
} from "./subgraphDataContext";
import { BidsGraphql, AuctionGraphql } from "./useAuctionSubgraph"
import { usePendingTransactions } from "./pendingTransactionsContext";
import { SUBGRAPHS } from "../constants/constants";
import { isProduction, SUBGRAPH_URI } from "../utils/env";
import { AuctionData, AugmentedAuctionData, AugmentedBidData, BidData } from "../models/auction";
import { useGlobalState } from "../store/store";
import { impersonateAddress } from "../utils/development";

const useFetchSubgraphData = () => {
  const [globalAuctionId, ] = useGlobalState(
    "auctionId"
  );
  const { account: acc, chainId } = useWeb3React();
  const account = impersonateAddress ? impersonateAddress : acc;
  const [data, setData] =
    useState<SubgraphDataContextType>(defaultSubgraphData);
  const { transactionsCounter } = usePendingTransactions();
  console.log(transactionsCounter)

  const [, setMulticallCounter] = useState(0);

  const doMulticall = useCallback(async () => {
    if (!isProduction()) {
      console.time("Subgraph Data Fetch");
    }

    /**
     * We keep track with counter so to make sure we always only update with the latest info
     */
    let currentCounter: number;
    setMulticallCounter((counter) => {
      currentCounter = counter + 1;
      return currentCounter;
    });

    const allSubgraphResponses = await Promise.all(
      SUBGRAPHS.map(async (chainId) => {
        const response = await axios.post(
          SUBGRAPH_URI[chainId],
          {
            query: `{
                ${
                  globalAuctionId != ""
                    ?`
                      ${AuctionGraphql()}
                      ${BidsGraphql(globalAuctionId)}
                    `
                   :  `${AuctionGraphql()}`
                }
            }`
          }
        );
        return {chainId: chainId,
          data: response.data.data};
      })
    );
    
    const auctions = allSubgraphResponses.map((data) => {
      return data.data.auctions.map((auction: AuctionData) => {
        const augmentedAuction: any = auction
        augmentedAuction.chainId = data.chainId
        return augmentedAuction as AugmentedAuctionData
      })
    }).flat()

    let bids = []
    if (globalAuctionId != "") {
      bids = allSubgraphResponses.map((data) => {
        return data.data.bids.map((bid: BidData) => {
          const augmentedBid: any = bid
          augmentedBid.chainId = data.chainId
          return augmentedBid as AugmentedBidData
        })
      }).flat()
    }

    const responses = {
      auctions: auctions,
      bids: bids
    }

    setMulticallCounter((counter) => {
      if (counter === currentCounter) {
        setData((prev) => ({
          ...prev,
          responses: responses,
          loading: false,
        }));
      }

      return counter;
    });

    if (!isProduction()) {
      console.timeEnd("Subgraph Data Fetch");
    }
  }, [account, chainId]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall, transactionsCounter]);

  return data;
};

export default useFetchSubgraphData;
