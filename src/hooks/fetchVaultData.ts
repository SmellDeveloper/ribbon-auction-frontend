import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { isAvaxAuction, AuctionList } from "../constants/constants";
import { CHAINID, isDevelopment, isProduction } from "../utils/env";
import { useWeb3Context } from "./web3Context";
import { defaultVaultData, VaultData, VaultDataResponses } from "../models/auction"
import { isAuctionSupportedOnChain } from "../utils/auction";
import { getVault } from "./useAuction";

const useFetchVaultData = (): VaultData => {
  const {
    chainId,
    active: web3Active,
    library,
  } = useWeb3React();
  const { provider: avaxProvider } = useWeb3Context(isDevelopment() ? CHAINID.AVAX_FUJI : CHAINID.AVAX_MAINNET);
  const { provider: ethProvider } = useWeb3Context(isDevelopment() ? CHAINID.ETH_KOVAN : CHAINID.ETH_MAINNET);

  const [data, setData] = useState<VaultData>(defaultVaultData);
  const [, setMulticallCounter] = useState(0);

  const doMulticall = useCallback(async () => {
    if (!isProduction()) {
      console.time("Data Fetch");
    }

    let currentCounter: number;
    setMulticallCounter((counter) => {
      currentCounter = counter + 1;
      return currentCounter;
    });

    const responses = await Promise.all(
      AuctionList.map(async (auction) => {
        const inferredProviderFromVault = isAvaxAuction(auction) ? avaxProvider : ethProvider;
        const active = Boolean(
          web3Active && isAuctionSupportedOnChain(auction, chainId || inferredProviderFromVault?._network?.chainId)
        );

        const contract = getVault(library || inferredProviderFromVault, auction, active);
        if (!contract) {
          return { auction };
        }

        /**
         * 1. Total Balance
         * 2. Cap
         */
        const promises: Promise<
          | BigNumber
          | { amount: BigNumber; round: number }
          | { round: number }
          | { share: BigNumber; round: number }
        >[] = [
          contract.totalBalance(),
          contract.vaultState(),
          contract.pricePerShare(),
          contract.totalBalance(),
        ];

        const [
          totalBalance,
          _vaultState,
          pricePerShare,
          estimatedSize
        ] = await Promise.all(
          promises.map((p) => p.catch((e) => BigNumber.from(0)))
        );

        const vaultState = (
          (_vaultState as { queued?: number }).queued ? _vaultState : { queued: 0 }
        ) as { queued: number };

        return {
          auction,
          totalBalance,
          queued: vaultState.queued,
          pricePerShare,
          estimatedSize
        };
      })
    );

    setMulticallCounter((counter) => {
      if (counter === currentCounter) {
        setData((prev) => ({
          responses: Object.fromEntries(
            responses.map(({ auction, ...response }) => [
                auction,
              {
                ...prev.responses[auction],
                ...response,
              },
            ])
          ) as VaultDataResponses,
          loading: false,
        }));
      }

      return counter;
    });

    if (!isProduction()) {
      console.timeEnd("Data Fetch");
    }
  }, [chainId, library, web3Active, avaxProvider, ethProvider]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall]);
  // console.log(data) // FOR LOGGING ONLY
  return data;
};

export default useFetchVaultData;
