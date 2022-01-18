import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useMemo } from "react";
import AuctionInformation from "../../components/Auction/AuctionInformation";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import useTextAnimation from "../../hooks/useTextAnimation";
import useAuctionOption from "../../hooks/useAuctionOption";
import moment from "moment";
import { useAuctionsData, useBidsData } from "../../hooks/subgraphDataContext";
import { NETWORK_ALT_DESCRIPTION } from "../../constants/constants";
import { CHAINID } from "../../utils/env";
import { switchChains } from "../../utils/switch";
import { AnimatePresence } from "framer-motion";
import BidModule from "../../components/Bid/BidModule";
import BidInformationPage from "../../components/Bid/BidInformation";
import ClaimModule from "../../components/Claim/ClaimModule";
import { useUserBalance } from "../../hooks/web3DataContext";
import LiveIndicator from "../../components/Indicator/Live";
import { useGlobalState } from "../../store/store";
import { BigNumber } from "ethers";
import { usePendingTransactions } from "../../hooks/pendingTransactionsContext";

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

const AuctionPage = () => {
  
  const { active, chainId: currentChainId, account, library } = useWeb3React();
  const [globalAuctionId, setGlobalAuctionId] = useGlobalState(
    "auctionId"
  );
  const { auction, auctionTitle } = useAuctionOption();
  const [auctionId, underlying, strike, type] = auctionTitle!.split("-")

  const { data: balances, loading: balanceLoading } = useUserBalance()
  const { data: auctions, loading: auctionsLoading } = useAuctionsData(auctionId)
  const { data: bids, loading: bidsLoading } = useBidsData(auctionId)
  const data = auctions[0]

  const loading = auctionsLoading || bidsLoading || balanceLoading

  const loadingText = useTextAnimation()
  
  const handleSwitchChain = useCallback(
    async (chainId: number) => {
      if (library && currentChainId !== chainId) {
        await switchChains(library, chainId);
      }
    },
    [library, currentChainId]
  );

  const renderBidModule = useMemo(()=>{
    return (<>
      <BidModule auctionData={data}></BidModule>
      <BidInformationPage auctionData={data} bidData={bids}></BidInformationPage>
    </>
    )
  }, [bids, data])

  useEffect(() => {
    setGlobalAuctionId(auctionId)
  }, [auctionId])
  
  if (!loading) {
    if (!data) {
      return <Redirect to="/" />;
    } else {

      const type = data.option.put ? "P" : "C"
      const time = moment.unix(Number(data.option.expiry)).format("DDMMMYY").toUpperCase()
      
      if (auctionTitle != `${auctionId}-${underlying}-${time}-${type}`) {
        return <Redirect to="/" />;
      }
      // console.log(bids)
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
                  <LiveIndicator></LiveIndicator>
                </IndicatorContainer>
                  </>
                )
                : "CONCLUDED"
              }
            </StatusTitle>
            
          </StatusTitleContainer>
    
          <AuctionInformation data={data} bidData={bids}></AuctionInformation>
          
          <ListContainer>
            <WalletModule>
              
                {active
                  ? currentChainId == data.chainId
                    ? !data.live ? <ClaimModule auctionData={data} bidData={bids}></ClaimModule>
                      : (renderBidModule)
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

