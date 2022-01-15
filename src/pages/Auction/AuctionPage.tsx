import { useWeb3React } from "@web3-react/core";
import { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router";
import {
  ArrowIcon
} from "../../assets/icons/icons"
import AuctionInformation from "../../components/Auction/AuctionInformation";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import theme from "../../design/theme";
import colors from "../../design/colors";
import useTextAnimation from "../../hooks/useTextAnimation";
import useAuctionOption from "../../hooks/useVaultOption";
import { getAssetColor, getAssetLogo } from "../../utils/asset";
import moment from "moment";
import { Assets } from "../../store/types";
import { formatUnits } from "ethers/lib/utils";
import { BigNumber, ethers } from "ethers";
import { useAuctionsData, useBidsData } from "../../hooks/subgraphDataContext";
import { getGnosisAuction, GNOSIS_AUCTION, NETWORK_ALT_DESCRIPTION } from "../../constants/constants";
import { CHAINID } from "../../utils/env";
import { switchChains } from "../../utils/chainSwitching";
import { AnimatePresence } from "framer-motion";
import { useUserBalance } from "../../hooks/web3DataContext";
import { impersonateAddress } from "../../utils/development";
import useVaultActionForm from "../../hooks/useVaultActionForm";
import useTokenAllowance from "../../hooks/useTokenAllowance";
import { usePendingTransactions } from "../../hooks/pendingTransactionsContext";
import { getERC20Token } from "../../hooks/useERC20Token";
import { useWeb3Context } from "../../hooks/web3Context";
import { wait } from "@testing-library/react";
import { parentPort } from "worker_threads";
import useAuction from "../../hooks/useVault";
import { encodeOrder } from "../../utils/order";

const StatusText = styled.span`
  font-size: 20px;
  font-weight: 300;
`

const ListContainer = styled.div`
  width: 100%;
  background-color: #F6F6F6;
  border-radius: 7px;
  padding: 30px;
  min-height: 200px;
  margin-bottom: 40px;
`

const EmptyDescriptionContainer = styled.div`
  font-size: 14px;
  display: flex;
  color: #8E8E8E;
  height: 140px;
  justify-content: center;
  align-items: center;
`

const EmptyBidsText = styled.div`
  font-size: 14px;
  display: flex;
  color: #8E8E8E;
  height: 40px;
  justify-content: center;
  align-items: center;
`

const LoadingContainer = styled.div`
  font-family: VCR;
  text-transform: uppercase;
  font-size: 40px;
  display: flex;
  color: #8E8E8E;
  height: 300px;
  justify-content: center;
  align-items: center;
`

const WrongNetworkDescriptionContainer = styled.div`
  font-size: 14px;
  height: 130px;
  display: flex;
  color: #8E8E8E;
  justify-content: center;
  align-items: center;
`

const BidHistoryCaption = styled.div`
  font-size: 12px;
  font-weight: 600;
  text-align: left;
`

const BidHistoryLogCaption = styled.div`
  font-family: VCR;
  font-size: 12px;
  font-weight: 300;
  text-align: left;
`

const BidHistoryTitle = styled.div<{ ratio: string }>`
  display: block;
  flex: ${(props) => props.ratio} 1 0;
  width: auto;
  padding: 15px 30px;
`

const BidHistoryLogItem = styled.div<{ ratio: string }>`
  display: block;
  flex: ${(props) => props.ratio} 1 0;
  width: auto;
  padding: 0px 30px;
`

const BidButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`

const WrongNetworkButtonContainer = styled.div`
`

const WrongNetworkText = styled.div`
  text-align: center;
  margin-bottom: 5px;
`

const ChangeNetworkButton = styled.button`
  font-family: VCR;
  font-size: 15px; 
  color: #FFFFFF;
  background-color: #424242;
  border-radius: 5px;
  border: none;
  padding: 9px 20px 10px 20px;
  line-height: 20px;
  vertical-align: text-top;
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

const StatusTitle = styled.div`
  margin-left: 10px;
  justify-content: center;
  align-items: center;
  display: flex;
  font-size: 20px;
  font-weight: 500;
`

const StatusTitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 500;
`

const IndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 3px;
  position: relative;
  width: 35px;
  height: 35px;
`

const WalletModule = styled.div`
  display: flex;
  justify-content: center;
  z-index: 1000;
`

const BiddingModal = styled.div`
  display: block;
  width: 500px;
`

const BidInformation = styled.div`
  display: block;
  flex: 1 1 0;
  width: 500px;
  margin-left: 30px;
`

const BidHistoryBlock = styled.div`
  background-color: #FFFFFF;
  border-radius: 5px;
  padding-bottom: 10px;
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

const BidInformationCaption = styled.div`
  font-family: VCR;
  margin-bottom: 13px;
  color: #464646;
  font-size: 20px;
  line-height: 16px;
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

const Input = styled.input<{color: string}>`
  font-family: VCR;
  background-color: ${(props) => props.color};
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

const BidHistoryTitleColumn = styled.div`
  display: flex;
  border-bottom: solid 1px #D6D6D6;
  width: 100%;
  height: 50px;
  margin-bottom: 10px;
`

const BidHistoryLogs = styled.div`
  padding: 5px 0px;
  color: #8D8D8D;
  display: flex;
  width: 100%;
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
const Blob = styled.div`
  background: #16CEB9;
	border-radius: 50%;
  margin: auto;
	height: 15px;
	width: 15px;

  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
	transform: scale(0.4);
	animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 #16CEB970;
    }
  
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px #16CEB900;
    }
  
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 #16CEB900;
    }
  }
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

const AuctionPage = () => {
//   usePullUp();
  
  const { active, chainId: currentChainId, account, library } = useWeb3React();
  const history = useHistory();
  const { auction, auctionTitle } = useAuctionOption();
  const [auctionId, underlying, strike, type] = auctionTitle!.split("-")
  const {
    handlePayableChange,
    handlePriceChange,
    handleSizeChange,
    handleMaxClick,
    auctionActionForm
  } = useVaultActionForm(auctionId);

  
  const color = getAssetColor(underlying as Assets)
  const Logo = getAssetLogo(underlying as Assets)

  const { data: balances, loading: balanceLoading } = useUserBalance()
  const { data: auctions, loading: auctionsLoading } = useAuctionsData(auctionId)
  const { data: bids, loading: bidsLoading } = useBidsData(auctionId)
  const data = auctions[0]

  const loading = auctionsLoading || bidsLoading || balanceLoading

  const { addPendingTransaction } = usePendingTransactions();
  const { provider } = useWeb3Context();

  const tokenContract = useMemo(() => {
    try {
      return getERC20Token(library, underlying.toLowerCase() as Assets, currentChainId!)
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

        // const txhash = tx.hash;

        // addPendingTransaction({
        //   txhash,
        //   type: "approval",
        //   amount: amount
        // });

        // // Wait for transaction to be approved
        // await provider.waitForTransaction(txhash, 5);
      } catch (err) {
      } finally {
        setWaitingApproval(false);
      }
    }
  }, [addPendingTransaction, provider, tokenContract]);

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
  }, [auctionActionForm, balances, data, loading])

  const quantityError = useMemo(() => {
    if (!loading) {
      if (Number(auctionActionForm.quantity)*10**8 > Number(data.size.toString())) {
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
    } else {
      return {
        error: false,
        msg: ""
      }
    }
  }, [auctionActionForm, balances, data, loading])

  const payableError = useMemo(() => {
    if (!loading && balances) {
      if (Number(auctionActionForm.payable) > Number(balances[data.bidding.symbol as Assets].toString())) {
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
  }, [auctionActionForm, balances, data, loading])

  const error = useMemo(() => {
    return payableError.error || completeError.error || quantityError.error
  }, [payableError, completeError, quantityError])

  // console.log(error)
  const handlePlaceOrder = useCallback(async () => {
    if (gnosisContract && !loading) {
  
      const bidBytes = bids.map((value) => {
        return value.bytes
      })

      try {
        const tx = await gnosisContract.placeSellOrders(
          auctionActionForm.auctionId,
          [ethers.utils.parseUnits(auctionActionForm.quantity, 8)],
          [ethers.utils.parseUnits(auctionActionForm.payable, data.bidding.decimals.toString())],
          !bidBytes ? bidBytes : ["0x0000000000000000000000000000000000000000000000000000000000000001"],
          "0x"
        )
      } catch {}

      // const txhash = tx.hash;
      // console.log(txhash)
    }
  }, [loading, error, gnosisContract, auctionActionForm, data, bids]);

  const handleClaimOrder = useCallback(async () => {
    if (gnosisContract && !loading) {
      console.log(bids)
      const bidBytes = bids.map((value) => {
        return value.bytes
      })
      console.log(bidBytes)
      console.log(account)
      try {
        const tx = await gnosisContract.claimFromParticipantOrder(
          auctionActionForm.auctionId,
          bidBytes,
        )
      } catch {}

      // const txhash = tx.hash;
      // console.log(txhash)
    }
  }, [loading, error, gnosisContract, auctionActionForm, data, bids]);
  

  const loadingText = useTextAnimation()

  const handleSwitchChain = useCallback(
    async (chainId: number) => {
      if (library && currentChainId !== chainId) {
        await switchChains(library, chainId);
      }
    },
    [library, currentChainId]
  );

  const allowance = useTokenAllowance(data?.bidding.symbol as Assets, getGnosisAuction(currentChainId!))

  const renderBiddingModule = useCallback(() => {
    const allowed = true // Number(allowance) > 0
    const color = allowed ? "#FFFFFF" : "#D6D6D6"
    const walletBalance = 
    balances[data.bidding.symbol as Assets]
      ? parseFloat(formatUnits(balances[data.bidding.symbol as Assets], data.bidding.decimals.toString())).toFixed(4)
        + " " + data.bidding.symbol
      : "LOADING..."

    return (
      <BiddingModal>
        <InputBlock>
          <InputCaption>OTOKEN QUANTITY<Error>{quantityError.error ? quantityError.msg : ""}</Error></InputCaption>
          <InputDiv>
            <Input color={color} disabled={!allowed}
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
          <SecondInputCaption>PRICE PER OTOKEN (IN {data.bidding.symbol})</SecondInputCaption>
          <Input color={color} disabled={!allowed}
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
          <Input color={color} disabled={!allowed}
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
  }, [data, payableError, completeError, quantityError, auctionActionForm, balances, allowance, waitingApproval, approveLoadingText])

  const renderBid = (
    index: number, 
    quantity: string, 
    price: string, 
    total: string, 
    symbol: string
  ) => {
    return (
      <BidHistoryLogs>
        <BidHistoryLogItem ratio="1">
          <BidHistoryLogCaption>{index}</BidHistoryLogCaption>
        </BidHistoryLogItem>
        <BidHistoryLogItem ratio="2">
          <BidHistoryLogCaption>{quantity}</BidHistoryLogCaption>
        </BidHistoryLogItem>
        <BidHistoryLogItem ratio="4">
          <BidHistoryLogCaption>{price} {symbol}</BidHistoryLogCaption>
        </BidHistoryLogItem>
        <BidHistoryLogItem ratio="4">
          <BidHistoryLogCaption>{total} {symbol}</BidHistoryLogCaption>
        </BidHistoryLogItem>
      </BidHistoryLogs>
    )
  }

  const renderClaimModule = useCallback(() => {
    const disable = bids.length > 0

   return disable ? (
   <BiddingModal>
    <InputBlock>
      <InputCaption>OTOKEN WON</InputCaption>
      <Input color={color} disabled={true}
            type="number"
            className="form-control"
            aria-label="payable"
            placeholder="0"
            value={auctionActionForm.payable}
            onChange={handlePayableChange}
          ></Input>
      <SecondInputCaption>{data.bidding.symbol} CLAIMABLE</SecondInputCaption>
      <Input color={color} disabled={true}
            type="number"
            className="form-control"
            aria-label="payable"
            placeholder="0"
            value={auctionActionForm.payable}
            onChange={handlePayableChange}
          ></Input>
    </InputBlock>
    <BidButtonContainer>
      <BidButton onClick={handleClaimOrder}>CLAIM</BidButton>
    </BidButtonContainer>
  </BiddingModal>) 
  : <EmptyDescriptionContainer>You have nothing to claim.</EmptyDescriptionContainer>
  },[data, bids])

  const renderWalletModule = useCallback(() => {
    return (
      (
        <>
        {renderBiddingModule()}
  <BidInformation>
      <BidInformationCaption>MY BIDS</BidInformationCaption>
        <BidHistoryBlock>
          <BidHistoryTitleColumn>
            <BidHistoryTitle ratio="1">
              <BidHistoryCaption>NO</BidHistoryCaption>
            </BidHistoryTitle>
            <BidHistoryTitle ratio="2">
              <BidHistoryCaption>QUANTITY</BidHistoryCaption>
            </BidHistoryTitle>
            <BidHistoryTitle ratio="4">
              <BidHistoryCaption>PRICE PER OTOKEN</BidHistoryCaption>
            </BidHistoryTitle>
            <BidHistoryTitle ratio="4">
              <BidHistoryCaption>TOTAL PAYABLE</BidHistoryCaption>
            </BidHistoryTitle>
          </BidHistoryTitleColumn>
          {bids.length > 0
            ? bids.sort((a, b) => {
                return Number(a.index) - Number(b.index)
              }).map((bid, index) => {
                const quantity = parseFloat(formatUnits(
                  BigNumber.from(bid.size), 8
                )).toFixed(2)
                const payable = parseFloat(formatUnits(
                  BigNumber.from(bid.payable), data.bidding.decimals.toString()
                )).toFixed(4)
                const price = parseFloat(formatUnits(
                  BigNumber.from(bid.payable).mul(10**8).div(bid.size), data.bidding.decimals.toString()
                )).toFixed(4)
                
                return renderBid(index+1, quantity, price, payable, "WBTC")
              })
            : <EmptyBidsText>You have not made any bids.</EmptyBidsText>
          }
        </BidHistoryBlock>
        </BidInformation>
        </>)
    )
  }, [bids, data])
  
  if (!loading) {
    if (!data) {
      console.log("hi")
      return <Redirect to="/" />;
    } else {
      const type = data.option.put ? "P" : "C"
      const time = moment.unix(Number(data.option.expiry)).format("DDMMMYY").toUpperCase()
      
      if (auctionTitle != `${auctionId}-${underlying}-${time}-${type}`) {
        return <Redirect to="/" />;
      }

      return (
        <AnimatePresence>
          <StatusTitleContainer>
            {/* <StatusTitle><StatusText>STATUS:</StatusText> STARTING IN 8 MINUTES</StatusTitle> */}
            <StatusText>{"STATUS:"}</StatusText> 
            <StatusTitle>
              {" "}
              {data.live
                ? (<>LIVE
                  <IndicatorContainer>
                    <Blob></Blob>
                  </IndicatorContainer>
                  </>
                )
                : "CONCLUDED"
              }
            </StatusTitle>
            
          </StatusTitleContainer>
    
          <AuctionInformation data={data}></AuctionInformation>
          
          <ListContainer>
            <WalletModule>
              
                {active
                  ? currentChainId == data.chainId
                    ? data.live ? renderClaimModule() : renderWalletModule()
                    : (<WrongNetworkDescriptionContainer>
                      <WrongNetworkButtonContainer>
                        <WrongNetworkText>
                          Wrong Network
                        </WrongNetworkText>
                        <WrongNetworkButtonContainer>
                          <ChangeNetworkButton onClick={() => handleSwitchChain(data.chainId as number)}>
                            CONNECT TO {NETWORK_ALT_DESCRIPTION[data.chainId as CHAINID]}
                          </ChangeNetworkButton>
                        </WrongNetworkButtonContainer>
                      </WrongNetworkButtonContainer>
                      </WrongNetworkDescriptionContainer>)
                  : <EmptyDescriptionContainer>Connect your wallet to make a bid.</EmptyDescriptionContainer>
                }
                {/* <BidInformationCaption>MY ALLOCATION</BidInformationCaption> */}
                {/* <AllocationBlock>
                  <FirstAllocationInformationItem>
                    <AllocationInformationCaption>Quantity (oTokens): </AllocationInformationCaption>
                    <AllocationInformationValue>8893</AllocationInformationValue>
                  </FirstAllocationInformationItem>
                  <AllocationInformationItem>
                    <AllocationInformationCaption>Price per oToken: </AllocationInformationCaption>
                    <AllocationInformationValue>0.0035 WETH</AllocationInformationValue>
                  </AllocationInformationItem>
                  <AllocationInformationItem>
                    <AllocationInformationCaption>Total Payable: </AllocationInformationCaption>
                    <AllocationInformationValue>31.12 WETH</AllocationInformationValue>
                  </AllocationInformationItem>
                </AllocationBlock> */}
            </WalletModule>
          </ListContainer>
        </AnimatePresence>
      )
    }
  } else {
    return <LoadingContainer>{loadingText}</LoadingContainer>
  }
};

export default AuctionPage;

