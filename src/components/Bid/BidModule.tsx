import { useWeb3React } from "@web3-react/core";
import React, { useCallback, useMemo, useState } from "react";
import {
  ArrowIcon
} from "../../assets/icons/icons"
import styled from "styled-components";
import theme from "../../design/theme";
import useTextAnimation from "../../hooks/useTextAnimation";
import { Assets } from "../../store/types";
import { formatUnits } from "ethers/lib/utils";
import { ethers } from "ethers";
import { useBidsData } from "../../hooks/subgraphDataContext";
import { getGnosisAuction } from "../../constants/constants";
import { useUserBalance } from "../../hooks/web3DataContext";
import useVaultActionForm from "../../hooks/useVaultActionForm";
import useTokenAllowance from "../../hooks/useTokenAllowance";
import { usePendingTransactions } from "../../hooks/pendingTransactionsContext";
import { getERC20Token } from "../../hooks/useERC20Token";
import { useWeb3Context } from "../../hooks/web3Context";
import useAuction from "../../hooks/useVault";
import { AuctionData, AugmentedBidData } from "../../models/auction";

const BidButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`

const BidButton = styled.button`
  font-family: VCR;
  font-size: 15px; 
  color: #FFFFFF;
  background-color: #424242;
  border-radius: 5px;
  border: none;
  padding: 9px 20px 10px 20px;
  line-height: 20px;
  vertical-align: text-top;
  height: 41px;
  width: 100%;

  &:hover {
    opacity: ${theme.hover.opacity};
  }

  &:disabled {
    opacity: ${theme.hover.opacity};
  }
`

const BiddingModal = styled.div`
  display: block;
  width: 500px;
`
const InputBlock = styled.div`
  background-color: #FFFFFF;
  border-radius: 5px;
  padding: 25px 30px 30px 30px;
`

const SecondInputBlock = styled.div`
  margin-top: 25px;
  background-color: #FFFFFF;
  border-radius: 5px;
  padding: 25px 30px 30px 30px;
`

const InputCaption = styled.div`
  display: flex;
  font-family: VCR;
  background-color: #FFFFFF;
  border-radius: 5px;
  margin-bottom: 5px;
  color: #464646;
  font-size: 14px;
  font-weight: 600;
`

const SecondInputCaption = styled.div`
  font-family: VCR;
  background-color: #FFFFFF;
  border-radius: 5px;
  margin-bottom: 5px;
  margin-top: 15px;
  color: #464646;
  font-size: 14px;
  font-weight: 600;
`

const Input = styled.input`
  font-family: VCR;
  border-radius: 5px;
  border: solid 1px #C1C1C1;
  width: 100%;
  height: 50px;
  padding: 10px;
  font-size: 24px;
  
  &::placeholder {
    opacity: 0.2; 
  }
`

const InputDiv = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`

const TradeSymbol = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 50%;
  background-color: #FFFFFF;
  border: solid 1px #D3D3D3;
  height: 50px;
  width: 50px;
  margin-top: -17px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: -40px;
  z-index: 1000;
`

const BalanceText = styled.div`
  margin-top: 3px;
  color: #8E8E8E;
  font-size: 13px;
`

const MaxButton = styled.button`
  font-family: VCR;
  font-size: 14px;
  position: absolute;
  background-color: unset;
  border: unset;
  right: 0;
  height: 50px;
  color: #8D8D8D;
  padding: 0px 15px;
`

const Error = styled.span`
  margin-left: auto;
  color: red;
`

const BidModule: React.FC<{
    auctionData: AuctionData
}> = ({
  auctionData
}) => {
  
  const { chainId: currentChainId, library } = useWeb3React();
  const {
    handlePayableChange,
    handlePriceChange,
    handleSizeChange,
    handleMaxClick,
    auctionActionForm
  } = useVaultActionForm(auctionData.id);

  const { data: balances, loading: balanceLoading } = useUserBalance()
  const { data: bids, loading: bidsLoading } = useBidsData(auctionData.id)

  const loading = !bidsLoading && !balanceLoading
  const biddingToken = auctionData.bidding.symbol as Assets
  const decimals = auctionData.bidding.decimals as number

  const { addPendingTransaction } = usePendingTransactions();
  const { provider } = useWeb3Context();

  const tokenContract = useMemo(() => {
    try {
      return getERC20Token(library, biddingToken.toLowerCase() as Assets, currentChainId!)
    } catch {
      return undefined
    }
  }, [currentChainId, library]);

  const gnosisContract = useAuction()

  const [waitingApproval, setWaitingApproval] = useState(false);
  const approveLoadingText = useTextAnimation(waitingApproval, {
    texts: ["APPROVING", "APPROVING .", "APPROVING ..", "APPROVING ..."],
    interval: 250,
  });

  const handleApproveToken = useCallback(async () => {
    setWaitingApproval(true);
    console.log(tokenContract)
    if (tokenContract) {
      const amount =
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

      try {
        const tx = await tokenContract.approve(
          getGnosisAuction(currentChainId!)!,
          amount
        );
      } catch (err) {
      } finally {
        setWaitingApproval(false);
      }
    }
  }, [addPendingTransaction, provider, tokenContract]);

  
  const quantityError = useMemo(() => {
    if (Number(auctionActionForm.quantity)*10**8 > Number(auctionData.size.toString())) {
        return {
            error: true,
            msg: "EXCEEDS AMOUNT AVAILABLE"
        }
    } else {
        return {
            error: false,
            msg: ""
        }
    }
  }, [auctionActionForm, auctionData])

  const payableError = useMemo(() => {
    if (!loading) {
      if (Number(auctionActionForm.payable) > Number(balances[biddingToken].toString())) {
        return {
          error: true,
          msg: "INSUFFICIENT BALANCE"
        }
      } else {
        return {
          error: false,
          msg: ""
        }
      }
    } else {
      return {
        error: false,
        msg: ""
      }
    }
  }, [auctionActionForm, balances, auctionData, loading])

  const completeError = useMemo(() => {
    if (!loading) {
      if (Number(auctionActionForm.price) == 0 || Number(auctionActionForm.payable) == 0 || Number(auctionActionForm.quantity) == 0) {
        return {
          error: true,
          msg: ""
        }
      } else {
        return {
          error: false,
          msg: ""
        }
      }
    } else {
      return {
        error: false,
        msg: ""
      }
    }
  }, [auctionActionForm, balances, auctionData, loading])

  const error = useMemo(() => {
    return payableError.error || completeError.error || quantityError.error
  }, [payableError, completeError, quantityError])

//   // console.log(error)
  const handlePlaceOrder = useCallback(async () => {
    if (gnosisContract && !loading) {
  
      const bidBytes = bids.map((value: AugmentedBidData) => {
        return value.bytes
      })

      try {
        const tx = await gnosisContract.placeSellOrders(
          auctionActionForm.auctionId,
          [ethers.utils.parseUnits(auctionActionForm.quantity, 8)],
          [ethers.utils.parseUnits(auctionActionForm.payable, auctionData.bidding.decimals.toString())],
          !bidBytes ? bidBytes : ["0x0000000000000000000000000000000000000000000000000000000000000001"],
          "0x"
        )
      } catch {}

    }
  }, [loading, error, gnosisContract, auctionActionForm, auctionData, bids]);

  const allowance = useTokenAllowance(auctionData.bidding.symbol as Assets, getGnosisAuction(currentChainId!))
  console.log(allowance)
  const allowed = Number(allowance) > 0
    

    const walletBalance = useMemo(() => {
        return loading
            ? `${parseFloat(formatUnits(balances[biddingToken], decimals)).toFixed(4)} ${biddingToken}`
            : "LOADING..."
    }, [balances, loading])

    return (
      <BiddingModal>
        <InputBlock>
          <InputCaption>OTOKEN QUANTITY<Error>{quantityError.error ? quantityError.msg : ""}</Error></InputCaption>
          <InputDiv>
            <Input disabled={!allowed}
              type="number"
              className="form-control"
              aria-label="quantity"
              placeholder="0"
              value={auctionActionForm.quantity}
              onChange={handleSizeChange}
            ></Input>
            <MaxButton onClick={handleMaxClick} disabled={!allowed}>
              MAX
            </MaxButton>
          </InputDiv>
          <SecondInputCaption>PRICE PER OTOKEN (IN {auctionData.bidding.symbol})</SecondInputCaption>
          <Input disabled={!allowed}
            type="number"
            className="form-control"
            aria-label="price"
            placeholder="0"
            value={auctionActionForm.price}
            onChange={handlePriceChange}
          ></Input>
        </InputBlock>
        <TradeSymbol><ArrowIcon color="#D3D3D3"></ArrowIcon></TradeSymbol>
        <SecondInputBlock>
          <InputCaption>TOTAL PAYABLE <Error>{payableError.error ? payableError.msg : ""}</Error></InputCaption>
          <Input disabled={!allowed}
            type="number"
            className="form-control"
            aria-label="payable"
            placeholder="0"
            value={auctionActionForm.payable}
            onChange={handlePayableChange}
          ></Input>
          <BalanceText>
            {"Wallet Balance: " + walletBalance} 
          </BalanceText>
        </SecondInputBlock>
        <BidButtonContainer>
          <BidButton onClick={allowed 
            ? handlePlaceOrder
            : handleApproveToken}  >{ //disabled={error}
              allowed
                ? "PLACE BID"
                : waitingApproval
                  ? approveLoadingText
                  : "APPROVE"}
          </BidButton>
        </BidButtonContainer>
      </BiddingModal>
    )
};

export default BidModule;

