import { useMemo } from "react";
import { useRouteMatch } from "react-router-dom";

const useAuctionOption = () => {
  const matchAuction = useRouteMatch<{ auctionTitle: string }>(
    "/auction/:auctionTitle"
  );

  const auction = useMemo(() => {
      const optionType = matchAuction?.params.auctionTitle.split("").pop() == "C"
        ? "call"
        : "put"

      const underlying = matchAuction?.params.auctionTitle.split("-")[0]

      return underlying + "-" + optionType
    } 
  ,[matchAuction])

  return { auction: auction, auctionTitle: matchAuction?.params.auctionTitle} ;
};

export default useAuctionOption;
