import { useWeb3React } from "@web3-react/core";
import React, { ReactNode, useMemo } from "react";
import { useHistory } from "react-router";
import {
  WBTCLogo,
  WETHLogo
} from "../../assets/icons/tokens"
import {
  TimerIcon,
  ArrowIcon
} from "../../assets/icons/icons"


import {
  BaseLink,
  Title,
} from "../../design";
// import PerformanceSection from "../DepositPage/PerformanceSection";
// import { isProduction } from "shared/lib/utils/env";

import sizes from "../../design/sizes";
import styled, { keyframes } from "styled-components";
// import usePullUp from "../../hooks/usePullUp";
import { Container } from "react-bootstrap";
import theme from "../../design/theme";
import colors from "../../design/colors";
import * as fs from "fs";
import useTextAnimation from "../../hooks/useTextAnimation";
// import TreasuryActionForm from "../../components/Vault/VaultActionsForm/TreasuryActionsForm";
// import VaultInformation from "../../components/Deposit/VaultInformation";
// import { useWhitelist } from "../../hooks/useWhitelist";
// import { treasuryCopy } from "../../components/Product/treasuryCopies";

const StatusText = styled.span`
  font-size: 20px;
  font-weight: 300;
`

const AuctionDetailedInformation = styled.div`
  border-radius: 5px;
  background-color: #FFFFFF;
  border: solid 0.5px #D1D1D1;
  margin-bottom: 30px;
`

const ListContainer = styled.div`
  width: 100%;
  background-color: #F6F6F6;
  border-radius: 7px;
  padding: 30px;
  min-height: 200px;
  margin-bottom: 40px;
`
const ListTitle = styled.div`
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 500;
`

const EmptyDescriptionContainer = styled.div`
  font-size: 14px;
  display: flex;
  color: #8E8E8E;
  height: 140px;
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

const AuctionItemContainer = styled.div`
  display: flex;
  height: 75px;
  padding: 17px;
  border-radius: 2px;
  background-color: #FFFFFF;
`

const LiveAuctionItemContainer = styled.div`
  display: flex;
  height: 125px;
  padding: 17px;
  width: 100%;
  border-bottom: solid 1px #D1D1D1;
`

const LogoContainer = styled.div<{ color: string }>`
  height: 41px;
  min-width: 41px;
  margin-right: 12px;
  border: solid 1px ${(props) => props.color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

const LiveLogoContainer = styled.div<{ color: string }>`
  height: 91px;
  min-width: 91px;
  margin-right: 20px;
  border: solid 1px ${(props) => props.color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

const AuctionMainDescription = styled.div`
  display: block;
  margin-right: 20px;
`

const AuctionTitle = styled.div`
  font-family: VCR;
  font-size: 24px;
  line-height: 20px;
  margin-bottom: 4px;
`

const DescriptionThin = styled.div`
  font-size: 20px;
  font-weight: 300;
`

const DescriptionThick = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
`

const InformationCaption = styled.div`
  font-size: 20px;
  font-weight: 300;
  text-align: center;
`

const InformationValue = styled.div`
  font-family: VCR;
  font-size: 24px;
  font-weight: 500;
  line-height: 16px;
  text-align: center;
  color: ${colors.asset.WETH};
`

const AdditionalInformationCaption = styled.div`
  font-size: 15px;
  font-weight: 300;
  text-align: center;
`

const AdditionalInformationValue = styled.div`
  font-family: VCR;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  margin-top: -7px;
`

const AllocationInformationCaption = styled.div`
  font-size: 12px;
  font-weight: 300;
  text-align: center;
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

const AllocationInformationValue = styled.div`
  font-family: VCR;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  margin-top: -7px;
  color: #16CEB9;
`

const Timer = styled.div`
  display: flex;
  height: 100px;
  font-family: VCR;
  font-size: 30px;
  text-align: center;
  align-items: center;
`

const TimerText = styled.div`
  margin-top: -2px;
  margin-left: 10px;
  color: ${colors.asset.WETH};
`

const StackedAuctionInformation = styled.div`
  display: block;
  margin-left: auto;
`

const AuctionInformation = styled.div`
  display: flex;
  padding: 3px;
  align-items: center;
  margin-left: auto;
`

const InformationItem = styled.div`
  display: block
`

const LiveInformationItem = styled.div`
  display: block;
  min-width: 100px;
  margin-bottom: 5px;
  margin-left: 60px;
`

const AdditionalInformationItem = styled.div`
  display: block;
  flex: 1 1 0;
  width: auto;
  border-left: solid 1px #D1D1D1;
  padding: 10px;
`

const FirstAdditionalInformationItem = styled.div`
  display: block;
  flex: 1 1 0;
  width: auto;
  padding: 10px;
`

const AllocationInformationItem = styled.div`
  display: block;
  flex: 1 1 0;
  width: auto;
  padding: 10px;
`

const FirstAllocationInformationItem = styled.div`
  display: block;
  flex: 1 1 0;
  width: auto;
  padding: 10px;
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

const ButtonContainer = styled.div`
  display: flex;
  margin-left: 80px;
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

const ViewButton = styled.button`
  font-family: VCR;
  font-size: 20px; 
  color: #FFFFFF;
  background-color: #424242;
  border-radius: 5px;
  border: none;
  padding: 9px 20px 10px 20px;
  line-height: 20px;
  vertical-align: text-top;
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
`

const Separator = styled.div`
  width: 1px;
  height: 20px;
  background-color: #D3D3D3;
  margin: 0px 20px;
`

const LiveContainer = styled.div`
  background-color: #E9FFF6;
  width: calc(100% + 2*30px);
  border-radius: 7px;
  padding: 15px 30px 30px 30px;
  margin: 0px -30px;
  min-height: 165px;
  margin-bottom: 40px;
`

const LiveAuctionTitle = styled.div`
  font-family: VCR;
  font-size: 34px;
  margin-top: 4px;
  margin-bottom: -5px;
`

const LiveTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
`

const LiveTitleContainer = styled.div`
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
const AdditionalDetailsContainer = styled.div`
  display: flex;
`

const InnerCircle = styled.div`
  margin-top: 22.5%;
  margin-left: 22.5%;
  position: absolute;
  width: 55%;
  height: 55%;
  background-color: #00FF47;
  border-radius: 50%;
`

const OuterCircle = styled.div`
  margin-top: 7.5%;
  margin-left: 7.5%;
  position: absolute;
  width: 85%;
  height: 85%;
  border: solid 1px rgba(0, 255, 71, 0.50);
  border-radius: 50%;
`

const OuterOuterCircle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: solid 1px rgba(0, 255, 71, 0.36);
  border-radius: 50%;
`

const WalletModule = styled.div`
  display: flex;
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

const InformationBlock = styled.div`
  color: #8D8D8D;
  display: block;
  background-color: #FFFFFF;
  border-radius: 5px;
  padding: 25px 30px 30px 30px;
`

const BidHistoryBlock = styled.div`
  background-color: #FFFFFF;
  border-radius: 5px;
  padding-bottom: 10px;
`

const AllocationBlock = styled.div`
  margin-bottom: 20px;
  display: flex;
  background-color: #FFFFFF;
  border-radius: 5px;
  border: solid 2px #16CEB950;
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
  border-radius: 5px;
  margin-bottom: 5px;
  color: #464646;
  font-size: 20px;
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
  background-color: #FFFFFF;
  border-radius: 5px;
  border: solid 1px #C1C1C1;
  width: 100%;
  height: 50px;
  padding: 10px;
  font-size: 24px;
`

const BidHistoryTitleColumn = styled.div`
  display: flex;
  border-bottom: solid 1px #464646;
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

const AuctionPage = () => {
//   usePullUp();
  const { active } = useWeb3React();
  const history = useHistory();

//   const web3Whitelist = useWhitelist();
//   const whitelist = !isProduction() 
//     ? (active ? "T-PERP-C" : undefined)
//     : web3Whitelist;

//   if (whitelist) {
//     history.push("/treasury/" + whitelist)
//   }

//   const vaultInformation = (
//     <VaultInformation
//       loading={false}
//       vaultDeposit={0}
//       vaultYield={0}
//       displayData={{ deposit: "---", yield: "---" }}
//       asset={"USDC"}
//     />
//   );

//   return (
//     <>
//       <HeroSection
//         vaultInformation={vaultInformation}
//       />

//       <DepositPageContainer className="py-5">
//         <div className="row">
//           <PerformanceSection
//             active={true}
//           />

//           {/* Form for desktop */}
//           <DesktopActionsFormContainer className="flex-column col-xl-5 offset-xl-1 col-md-6">
//             <TreasuryActionForm variant="desktop"/>
//           </DesktopActionsFormContainer>
//         </div>

//       </DepositPageContainer>

//     </>
//   );

  return (
    <>
      <LiveTitleContainer>
        {/* <LiveTitle><StatusText>STATUS:</StatusText> STARTING IN 8 MINUTES</LiveTitle> */}
        {/* <LiveTitle><StatusText>STATUS:</StatusText> CONCLUDED</LiveTitle> */}
        <LiveTitle><StatusText>STATUS:</StatusText> LIVE</LiveTitle>
        <IndicatorContainer>
          <Blob></Blob>
        </IndicatorContainer>
      </LiveTitleContainer>
      
      <AuctionDetailedInformation>
        <LiveAuctionItemContainer>
          <LiveLogoContainer color={colors.asset.WETH}>
            <WETHLogo height="70px" width="70px"></WETHLogo>
          </LiveLogoContainer>
          <AuctionMainDescription>
            <LiveAuctionTitle>
              ETH-3300-07JAN22-PUT
            </LiveAuctionTitle>
            <DescriptionThin>
              Expiry: 07 Jan 2022, 08:00AM UTC
            </DescriptionThin>
          </AuctionMainDescription>
          <AuctionInformation>
            <LiveInformationItem>
              <InformationCaption>Current Price per oToken: </InformationCaption>
              <InformationValue>0.0035 WETH</InformationValue>
            </LiveInformationItem>
            <LiveInformationItem>
              <InformationCaption>Filled: </InformationCaption>
              <InformationValue>60%</InformationValue>
            </LiveInformationItem>
            <LiveInformationItem>
              <Timer><TimerIcon color={colors.asset.WETH} height="25px" width="25px"></TimerIcon><TimerText>14:21</TimerText></Timer>
              {/* <Timer><TimerIcon color={colors.asset.WETH} height="25px" width="25px"></TimerIcon><TimerText>CLOSED</TimerText></Timer> */}
              {/* <Timer><TimerIcon color={colors.asset.WETH} height="25px" width="25px"></TimerIcon><TimerText>--:--</TimerText></Timer> */}
            </LiveInformationItem>
          </AuctionInformation>
        </LiveAuctionItemContainer>
        <AdditionalDetailsContainer>
          <FirstAdditionalInformationItem>
            <AdditionalInformationCaption>Size (oTokens): </AdditionalInformationCaption>
            <AdditionalInformationValue>8893</AdditionalInformationValue>
          </FirstAdditionalInformationItem>
          <AdditionalInformationItem>
            <AdditionalInformationCaption>Min. Bid (per oToken): </AdditionalInformationCaption>
            <AdditionalInformationValue>0.0035 WETH</AdditionalInformationValue>
          </AdditionalInformationItem>
          <AdditionalInformationItem>
            <AdditionalInformationCaption>Strike Price: </AdditionalInformationCaption>
            <AdditionalInformationValue>$250.00</AdditionalInformationValue>
          </AdditionalInformationItem>
          <AdditionalInformationItem>
            <AdditionalInformationCaption>Current Spot Price: </AdditionalInformationCaption>
            <AdditionalInformationValue>$225.12</AdditionalInformationValue>
          </AdditionalInformationItem>
          <AdditionalInformationItem>
            <AdditionalInformationCaption>Underlying Token: </AdditionalInformationCaption>
            <AdditionalInformationValue>WETH</AdditionalInformationValue>
          </AdditionalInformationItem>
          <AdditionalInformationItem>
            <AdditionalInformationCaption>Bidding Token: </AdditionalInformationCaption>
            <AdditionalInformationValue>WETH</AdditionalInformationValue>
          </AdditionalInformationItem>
        </AdditionalDetailsContainer>
      </AuctionDetailedInformation>
      
      <ListContainer>
        {/* <EmptyDescriptionContainer>Connect your wallet to make a bid.</EmptyDescriptionContainer> */}
        {/* <EmptyDescriptionContainer>Auction will start soon.</EmptyDescriptionContainer> */}
        {/* <EmptyDescriptionContainer>Connect your wallet to claim.</EmptyDescriptionContainer> */}
        {/* <WrongNetworkDescriptionContainer>
        <WrongNetworkButtonContainer>
          <WrongNetworkText>
            Wrong Network
          </WrongNetworkText>
          <WrongNetworkButtonContainer>
            <ChangeNetworkButton>CONNECT TO ETHEREUM MAINNET</ChangeNetworkButton>
          </WrongNetworkButtonContainer>
        </WrongNetworkButtonContainer>
        </WrongNetworkDescriptionContainer> */}
        <WalletModule>
          <BiddingModal>
            <InputBlock>
              <InputCaption>OTOKEN QUANTITY</InputCaption>
              <Input type="number" placeholder="0.0"></Input>
              <SecondInputCaption>PRICE PER OTOKEN (IN AAVE)</SecondInputCaption>
              <Input type="number" placeholder="0.0"></Input>
            </InputBlock>
            <TradeSymbol><ArrowIcon color="#D3D3D3"></ArrowIcon></TradeSymbol>
            <SecondInputBlock>
              <InputCaption>TOTAL PAYABLE</InputCaption>
              <Input type="number" placeholder="0.0"></Input>
              <BalanceText>Wallet Balance: 10 WETH</BalanceText>
            </SecondInputBlock>
            <BidButtonContainer>
              <BidButton>PLACE BID</BidButton>
            </BidButtonContainer>
          </BiddingModal>
          <BidInformation>
            <BidInformationCaption>MY ALLOCATION</BidInformationCaption>
            <AllocationBlock>
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
            </AllocationBlock>
            <BidInformationCaption>MY BIDS</BidInformationCaption>
            <BidHistoryBlock>
              <BidHistoryTitleColumn>
                <BidHistoryTitle ratio="1">
                  <BidHistoryCaption>NO</BidHistoryCaption>
                </BidHistoryTitle>
                <BidHistoryTitle ratio="2">
                  <BidHistoryCaption>QUANTITY</BidHistoryCaption>
                </BidHistoryTitle>
                <BidHistoryTitle ratio="3">
                  <BidHistoryCaption>PRICE PER OTOKEN</BidHistoryCaption>
                </BidHistoryTitle>
                <BidHistoryTitle ratio="3">
                  <BidHistoryCaption>TOTAL PAYABLE</BidHistoryCaption>
                </BidHistoryTitle>
              </BidHistoryTitleColumn>
              <BidHistoryLogs>
                <BidHistoryLogItem ratio="1">
                  <BidHistoryLogCaption>1</BidHistoryLogCaption>
                </BidHistoryLogItem>
                <BidHistoryLogItem ratio="2">
                  <BidHistoryLogCaption>1000</BidHistoryLogCaption>
                </BidHistoryLogItem>
                <BidHistoryLogItem ratio="3">
                  <BidHistoryLogCaption>0.0035 WETH</BidHistoryLogCaption>
                </BidHistoryLogItem>
                <BidHistoryLogItem ratio="3">
                  <BidHistoryLogCaption>4.20 WETH</BidHistoryLogCaption>
                </BidHistoryLogItem>
              </BidHistoryLogs>
              <BidHistoryLogs>
                <BidHistoryLogItem ratio="1">
                  <BidHistoryLogCaption>2</BidHistoryLogCaption>
                </BidHistoryLogItem>
                <BidHistoryLogItem ratio="2">
                  <BidHistoryLogCaption>800</BidHistoryLogCaption>
                </BidHistoryLogItem>
                <BidHistoryLogItem ratio="3">
                  <BidHistoryLogCaption>0.0035 WETH</BidHistoryLogCaption>
                </BidHistoryLogItem>
                <BidHistoryLogItem ratio="3">
                  <BidHistoryLogCaption>3.80 WETH</BidHistoryLogCaption>
                </BidHistoryLogItem>
              </BidHistoryLogs>
            </BidHistoryBlock>
          </BidInformation>
        </WalletModule>
      </ListContainer>
    </>
  )
};

export default AuctionPage;

