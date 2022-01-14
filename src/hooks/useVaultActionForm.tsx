import { useCallback, useEffect, useMemo } from "react";
import { BigNumber, ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";

// import {
//   GAS_LIMITS,
//   VaultMaxDeposit,
//   VaultOptions,
//   VaultVersion,
//   VaultAllowedDepositAssets,
//   isNativeToken,
// } from "shared/lib/constants/constants";
// import {
//   ACTIONS,
//   ActionType,
//   V2WithdrawOption,
//   V2WithdrawOptionList,
// } from "../components/Vault/VaultActionsForm/Modal/types";
import { initialBidActionForm, useWebappGlobalState } from "../store/store";
import { useAuctionsData } from "./subgraphDataContext";
import { useUserBalance } from "./web3DataContext";
import { Assets } from "../utils/asset";
// import useGasPrice from "shared/lib/hooks/useGasPrice";
// import {
//   useVaultData,
//   useV2VaultData,
//   useAssetsBalance,
// } from "shared/lib/hooks/web3DataContext";
// import { isETHVault } from "shared/lib/utils/vault";
// import { Assets } from "shared/lib/store/types";

export type VaultActionFormTransferData =
  | {
      availableCapacity: BigNumber;
      availableTransferAmount: BigNumber;
    }
  | undefined;

export type WithdrawMetadata = {
  allowStandardWithdraw?: boolean;
  instantWithdrawBalance?: BigNumber;
};

const useVaultActionForm = (auctionId: string) => {
  const [auctionActionForm, setAuctionActionForm] =
    useWebappGlobalState("bidActionForm");
  // const gasPrice = useGasPrice();
  /**
   * V1 vault data
   */
  // const {
  //   decimals,
  //   deposits,
  //   maxWithdrawAmount,
  //   vaultLimit,
  //   vaultBalanceInAsset,
  //   userAssetBalance,
  // } = useVaultData(vaultOption);

  const { data } = useAuctionsData(auctionId)
  const auctionData = data[0]
  /**
   * V2 vault data
   */
  // const {
  //   data: {
  //     cap: v2Cap,
  //     depositBalanceInAsset: v2DepositBalanceInAsset,
  //     lockedBalanceInAsset: v2LockedBalanceInAsset,
  //     totalBalance: v2TotalBalance,
  //     withdrawals: v2Withdrawals,
  //   },
  // } = useV2VaultData(vaultOption);
  const { data: assetsBalance } = useUserBalance();
  // const v2VaultBalanceInAsset = v2DepositBalanceInAsset.add(
  //   v2LockedBalanceInAsset
  // );
  // const vaultMaxDepositAmount = VaultMaxDeposit[vaultOption];
  // const receiveVaultData = useVaultData(
  //   vaultActionForm.receiveVault || vaultOption
  // );

  /**
   * Utility for reset action form
   */
  const resetActionForm = useCallback(() => {
    setAuctionActionForm((actionForm) => ({
      ...actionForm,
      inputAmount: "",
    }));
  }, [setAuctionActionForm]);

  /**
   * Reset form when vault option changes
   */
  useEffect(() => {
    setAuctionActionForm((prevVaultActionForm) => {
      if (prevVaultActionForm.auctionId !== auctionId) {
        return {
          ...initialBidActionForm,
          auctionId,
        };
      }

      return prevVaultActionForm;
    });
  }, [setAuctionActionForm, auctionId]);

  // const canTransfer = useMemo(() => {
  //   switch (vaultOption) {
  //     default:
  //       return false;
  //   }
  // }, [vaultOption]);

  // const transferData = useMemo((): VaultActionFormTransferData => {
  //   if (!canTransfer || vaultActionForm.actionType !== ACTIONS.transfer) {
  //     return undefined;
  //   }

  //   let availableCapacity = receiveVaultData.vaultLimit.sub(
  //     receiveVaultData.deposits
  //   );
  //   availableCapacity = availableCapacity.gte(BigNumber.from(0))
  //     ? availableCapacity
  //     : BigNumber.from(0);

  //   return {
  //     availableCapacity,
  //     availableTransferAmount: maxWithdrawAmount.lte(availableCapacity)
  //       ? maxWithdrawAmount
  //       : availableCapacity,
  //   };
  // }, [
  //   canTransfer,
  //   maxWithdrawAmount,
  //   receiveVaultData,
  //   vaultActionForm.actionType,
  // ]);

  // const withdrawMetadata = useMemo((): WithdrawMetadata => {
  //   switch (vaultActionForm.vaultVersion) {
  //     case "v2":
  //       return {
  //         allowStandardWithdraw:
  //           !v2LockedBalanceInAsset.isZero() || !v2Withdrawals.shares.isZero(),
  //         instantWithdrawBalance: v2DepositBalanceInAsset,
  //       };
  //   }

  //   return {};
  // }, [
  //   v2DepositBalanceInAsset,
  //   v2LockedBalanceInAsset,
  //   v2Withdrawals.shares,
  //   vaultActionForm.vaultVersion,
  // ]);

  /**
   * Handle user changing action type
   * Action type: deposit, withdraw
   */
  // const handleActionTypeChange = useCallback(
  //   (
  //     actionType: ActionType,
  //     vaultVersion: VaultVersion,
  //     {
  //       withdrawOption,
  //       migrateSourceVault,
  //     }: {
  //       withdrawOption?: V2WithdrawOption;
  //       migrateSourceVault?: VaultOptions;
  //     } = {}
  //   ) => {
  //     setAuctionActionForm((actionForm) => {
  //       // Do nothing if changing to the same action type
  //       if (
  //         actionType === actionForm.actionType &&
  //         vaultVersion === actionForm.vaultVersion &&
  //         withdrawOption === actionForm.withdrawOption
  //       ) {
  //         return actionForm;
  //       }

  //       switch (actionType) {
  //         case ACTIONS.transfer:
  //           switch (vaultOption) {
  //             case "rUSDC-ETH-P-THETA":
  //               return {
  //                 ...actionForm,
  //                 vaultVersion,
  //                 inputAmount: "",
  //                 actionType: ACTIONS.transfer,
  //                 receiveVault: "ryvUSDC-ETH-P-THETA",
  //               };
  //           }
  //           break;
  //         case ACTIONS.withdraw:
  //           /**
  //            * Only catch v2 vault and set default withdraw option if not provided
  //            */
  //           if (vaultVersion === "v2") {
  //             withdrawOption = withdrawOption || V2WithdrawOptionList[0];
  //             return {
  //               ...actionForm,
  //               vaultVersion,
  //               inputAmount: "",
  //               actionType,
  //               withdrawOption:
  //                 !withdrawMetadata.allowStandardWithdraw &&
  //                 withdrawOption === "standard"
  //                   ? "instant"
  //                   : withdrawOption,
  //             };
  //           }
  //           return {
  //             ...actionForm,
  //             vaultVersion,
  //             inputAmount: "",
  //             actionType,
  //           };
  //         case ACTIONS.deposit:
  //           return {
  //             ...actionForm,
  //             depositAsset: VaultAllowedDepositAssets[vaultOption][0],
  //             vaultVersion,
  //             inputAmount: "",
  //             actionType,
  //           };
  //         case ACTIONS.migrate:
  //           return {
  //             ...actionForm,
  //             migrateSourceVault: migrateSourceVault || vaultOption,
  //             vaultVersion,
  //             inputAmount: "",
  //             actionType,
  //           };
  //         default:
  //           return {
  //             ...actionForm,
  //             vaultVersion,
  //             inputAmount: "",
  //             actionType,
  //           };
  //       }

  //       return actionForm;
  //     });
  //   },
  //   [setAuctionActionForm, vaultOption, withdrawMetadata]
  // );

  /**
   * Handle deposit asset change
   */
  const handleDepositAssetChange = useCallback(
    (depositAsset: Assets) =>
      setAuctionActionForm((actionForm) => {
        // if (
        //   !actionForm.vaultOption ||
        //   actionForm.actionType !== ACTIONS.deposit
        // ) {
        //   return actionForm;
        // }

        return {
          ...actionForm,
          asset: depositAsset,
        };
      }),
    [setAuctionActionForm]
  );

  /**
   * Handle input amount changed
   */
  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;
      const decimal = auctionData.bidding.decimals.toString()

      let prevAction = auctionActionForm.prevAction
      if (auctionActionForm.lastAction != "price" || !auctionActionForm.prevAction) {
        prevAction = auctionActionForm.lastAction
      }
      console.log(prevAction)
      console.log(auctionActionForm.lastAction)
      let payable = auctionActionForm.payable
      if (auctionActionForm.quantity != "0" && prevAction == "quantity") {
        const price = ethers.utils.parseUnits(rawInput ? rawInput : "0", decimal)
        const quantity = ethers.utils.parseUnits(auctionActionForm.quantity, 8)
        payable = ethers.utils.formatUnits(price.mul(quantity).div(10**8), decimal)
      }

      let quantity = auctionActionForm.quantity
      if (auctionActionForm.payable != "0" && prevAction == "payable") {
        const price = ethers.utils.parseUnits(rawInput ? rawInput : "0", decimal)
        const payable = ethers.utils.parseUnits(auctionActionForm.payable, decimal)
        try {
          quantity = ethers.utils.formatUnits(payable.mul(10**8).div(price), 8)
        } catch {
          quantity = "0"
        }
      }
      
      setAuctionActionForm((actionForm) => ({
        ...actionForm,
        price: rawInput && parseFloat(rawInput) < 0 ? "" : rawInput,
        payable: payable,
        lastAction: "price",
        prevAction: prevAction,
        quantity: quantity
      }));
    },
    [setAuctionActionForm, auctionActionForm, data]
  );

  const handleSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;
      const decimal = auctionData.bidding.decimals.toString()

      let prevAction = auctionActionForm.prevAction
      if (auctionActionForm.lastAction != "quantity"|| !auctionActionForm.prevAction) {
        prevAction = auctionActionForm.lastAction
      }

      let payable = auctionActionForm.payable
      if (auctionActionForm.price != "0" && prevAction == "price") {
        const quantity = ethers.utils.parseUnits(rawInput ? rawInput : "0", 8)
        const price = ethers.utils.parseUnits(auctionActionForm.price, decimal)
        payable = ethers.utils.formatUnits(price.mul(quantity).div(10**8), decimal)
      }

      let price = auctionActionForm.price
      if (auctionActionForm.payable != "0" && prevAction == "payable") {
        const quantity = ethers.utils.parseUnits(rawInput ? rawInput : "0", 8)
        const payable = ethers.utils.parseUnits(auctionActionForm.payable, decimal)
        try {
          price = ethers.utils.formatUnits(payable.mul(10**8).div(quantity), decimal)
        } catch {
          price = "0"
        }
      }

      setAuctionActionForm((actionForm) => ({
        ...actionForm,
        quantity: rawInput && parseFloat(rawInput) < 0 ? "" : rawInput,
        payable: payable,
        lastAction: "quantity",
        prevAction: prevAction,
        price: price
      }));
    },
    [setAuctionActionForm, auctionActionForm, data]
  );

  const handlePayableChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;
      const decimal = auctionData.bidding.decimals.toString()

      let prevAction = auctionActionForm.prevAction
      if (auctionActionForm.lastAction != "payable" || !auctionActionForm.prevAction) {
        prevAction = auctionActionForm.lastAction
      }

      let quantity = auctionActionForm.quantity
      if (auctionActionForm.payable != "0" && prevAction == "price") {
        const price = ethers.utils.parseUnits(auctionActionForm.price, decimal)
        const payable = ethers.utils.parseUnits(rawInput ? rawInput : "0", decimal)
        try {
          quantity = ethers.utils.formatUnits(payable.mul(10**8).div(price), 8)
        } catch {
          quantity = "0"
        }
      }

      let price = auctionActionForm.price
      if (auctionActionForm.payable != "0" && prevAction == "quantity") {
        const quantity = ethers.utils.parseUnits(auctionActionForm.quantity, 8)
        const payable = ethers.utils.parseUnits(rawInput ? rawInput : "0", decimal)
        try {
          price = ethers.utils.formatUnits(payable.mul(10**8).div(quantity), decimal)
        } catch {
          price = "0"
        }
      } 

      setAuctionActionForm((actionForm) => ({
        ...actionForm,
        payable: rawInput && parseFloat(rawInput) < 0 ? "" : rawInput,
        lastAction: "payable",
        prevAction: prevAction,
        price: price,
        quantity: quantity
      }));
    },
    [setAuctionActionForm, auctionActionForm, data]
  );

  /**
   * Handle max press from user
   */
  const handleMaxClick = useCallback(() => {
    setAuctionActionForm((actionForm) => {
      // switch (actionForm.vaultVersion) {
      //   /**
      //    * V1 handle max click
      //    */
      //   case "v1":
      //     switch (actionForm.actionType) {
      //       case ACTIONS.deposit:
      //         const gasLimit = GAS_LIMITS[vaultOption].v1!.deposit;
      //         const gasFee = BigNumber.from(gasLimit.toString()).mul(
      //           BigNumber.from(gasPrice || "0")
      //         );
      //         const total = BigNumber.from(userAssetBalance);
      //         // TODO: Optimize the code to request gas fees only when needed
      //         const maxAmount = isETHVault(vaultOption)
      //           ? total.sub(gasFee)
      //           : total;
      //         const allowedMaxAmount = maxAmount.lte(
      //           vaultMaxDepositAmount.sub(vaultBalanceInAsset)
      //         )
      //           ? maxAmount
      //           : vaultMaxDepositAmount.sub(vaultBalanceInAsset);
      //         const userMaxAmount = allowedMaxAmount.isNegative()
      //           ? BigNumber.from("0")
      //           : allowedMaxAmount;

      //         // Fringe case: if amt of deposit greater than vault limit, return 0
      //         const vaultAvailableBalance = deposits.gt(vaultLimit)
      //           ? BigNumber.from("0")
      //           : vaultLimit.sub(deposits);

      //         // Check if max is vault availableBalance
      //         const finalMaxAmount = userMaxAmount.gt(vaultAvailableBalance)
      //           ? vaultAvailableBalance
      //           : userMaxAmount;
      //         return {
      //           ...actionForm,
      //           inputAmount: formatUnits(finalMaxAmount, decimals),
      //         };
      //       case ACTIONS.withdraw:
      //         return {
      //           ...actionForm,
      //           inputAmount: formatUnits(maxWithdrawAmount, decimals),
      //         };
      //       case ACTIONS.transfer:
      //         return {
      //           ...actionForm,
      //           inputAmount: transferData
      //             ? formatUnits(transferData.availableTransferAmount, decimals)
      //             : "",
      //         };
      //       case ACTIONS.migrate:
      //         return {
      //           ...actionForm,
      //           inputAmount: formatUnits(vaultBalanceInAsset, decimals),
      //         };
      //     }
      //     break;

      //   /**
      //    * V2 handle max click
      //    */
      //   case "v2":
      //     switch (actionForm.actionType) {
      //       case ACTIONS.deposit:
      //         const gasLimit = GAS_LIMITS[vaultOption].v2!.deposit;
      //         const gasFee = BigNumber.from(gasLimit.toString()).mul(
      //           BigNumber.from(gasPrice || "0")
      //         );
      //         const total = assetsBalance[actionForm.depositAsset!];
      //         // TODO: Optimize the code to request gas fees only when needed
      //         const maxAmount = isNativeToken(actionForm.depositAsset || "")
      //           ? total.sub(gasFee)
      //           : total;
      //         const allowedMaxAmount = maxAmount.lte(
      //           vaultMaxDepositAmount.sub(v2VaultBalanceInAsset)
      //         )
      //           ? maxAmount
      //           : vaultMaxDepositAmount.sub(v2VaultBalanceInAsset);
      //         const userMaxAmount = allowedMaxAmount.isNegative()
      //           ? BigNumber.from("0")
      //           : allowedMaxAmount;

      //         // Fringe case: if amt of deposit greater than vault limit, return 0
      //         const vaultAvailableBalance = v2TotalBalance.gt(v2Cap)
      //           ? BigNumber.from("0")
      //           : v2Cap.sub(v2TotalBalance);

      //         // Check if max is vault availableBalance
      //         const finalMaxAmount = userMaxAmount.gt(vaultAvailableBalance)
      //           ? vaultAvailableBalance
      //           : userMaxAmount;
      //         return {
      //           ...actionForm,
      //           inputAmount: formatUnits(finalMaxAmount, decimals),
      //         };
      //       case ACTIONS.withdraw:
      //         switch (actionForm.withdrawOption) {
      //           case "instant":
      //             return {
      //               ...actionForm,
      //               inputAmount: formatUnits(v2DepositBalanceInAsset, decimals),
      //             };
      //           case "complete":
      //             return {
      //               ...actionForm,
      //               inputAmount: formatUnits(v2Withdrawals.amount, decimals),
      //             };
      //           case "standard":
      //           default:
      //             return {
      //               ...actionForm,
      //               inputAmount: formatUnits(v2LockedBalanceInAsset, decimals),
      //             };
      //         }
      //     }
      // }
      const decimal = auctionData.bidding.decimals.toString()

      let prevAction = auctionActionForm.prevAction
      if (auctionActionForm.lastAction != "quantity" || !auctionActionForm.prevAction) {
        prevAction = auctionActionForm.lastAction
      }
      
      let payable = auctionActionForm.payable
      if (auctionActionForm.price != "0" && prevAction == "price") {
        const quantity = auctionData.size
        const price = ethers.utils.parseUnits(auctionActionForm.price, decimal)
        payable = ethers.utils.formatUnits(price.mul(quantity).div(10**8), decimal)
      }

      let price = auctionActionForm.price
      if (auctionActionForm.payable != "0" && prevAction == "payable") {
        const quantity = auctionData.size
        const payable = ethers.utils.parseUnits(auctionActionForm.payable, decimal)
        try {
          price = ethers.utils.formatUnits(payable.mul(10**8).div(quantity), decimal)
        } catch {
          price = "0"
        }
      }

      return {
        ...actionForm,
        quantity: formatUnits(auctionData.size, 8),
        lastAction: "quantity",
        prevAction: prevAction,
        payable: payable,
        price: price,
      };
    });
  }, [
    data, auctionActionForm, setAuctionActionForm
  ]);

  return {
    handleDepositAssetChange,
    handlePayableChange,
    handlePriceChange,
    handleSizeChange,
    handleMaxClick,
    resetActionForm,
    auctionActionForm
  };
};

export default useVaultActionForm;
