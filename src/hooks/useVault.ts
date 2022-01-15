import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { GnosisEasyAuction } from "../codegen";
import { GnosisEasyAuctionFactory } from "../codegen/GnosisEasyAuctionFactory";
import { AuctionAddressMap, AuctionOptions, getGnosisAuction } from "../constants/constants";
import { useWeb3Context } from "./web3Context";

export const getAuction = (
  library: any,
  useSigner: boolean = true,
  chainId: number
) => {

  const provider = useSigner ? library.getSigner() : library;

  const auction = GnosisEasyAuctionFactory.connect(
    getGnosisAuction(chainId),
    provider
  );
  return auction;
};

const useAuction = () => {
  const { library, active, chainId } = useWeb3React();
  const { provider } = useWeb3Context();
  const [auction, setauction] = useState<GnosisEasyAuction | null>(null);

  useEffect(() => {
    const auction = getAuction(library || provider, active, chainId || 1);
    setauction(auction);
  }, [active, library, provider, chainId]);

  return auction;
};
export default useAuction;
