import { RibbonThetaVault__factory } from "../codegen";
import { RibbonThetaVaultSTETH__factory } from "../codegen";
import { AuctionAddressMap, AuctionOptions } from "../constants/constants";

export const getVault = (
    library: any,
    auctionOption: AuctionOptions,
    useSigner: boolean = true
  ) => {
    if (!AuctionAddressMap[auctionOption].vault) {
      return null;
    }
  
    const provider = useSigner ? library.getSigner() : library;
  
    switch (auctionOption) {
      case "wstETH-call":
        return RibbonThetaVaultSTETH__factory.connect(
          AuctionAddressMap[auctionOption].vault!,
          provider
        );
      default:
        return RibbonThetaVault__factory.connect(
          AuctionAddressMap[auctionOption].vault!,
          provider
        );
    }
  };