import { RibbonThetaVaultFactory } from "../codegen/RibbonThetaVaultFactory";
import { RibbonThetaVaultSTETHFactory } from "../codegen/RibbonThetaVaultSTETHFactory";
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
        return RibbonThetaVaultSTETHFactory.connect(
          AuctionAddressMap[auctionOption].vault!,
          provider
        );
      default:
        return RibbonThetaVaultFactory.connect(
          AuctionAddressMap[auctionOption].vault!,
          provider
        );
    }
  };