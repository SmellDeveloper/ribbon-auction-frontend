import { useWeb3React } from "@web3-react/core";
import React, { ReactNode, useMemo } from "react";
import { useHistory } from "react-router";
import {
  WBTCLogo,
  WETHLogo
} from "../../assets/icons/tokens"

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
// import TreasuryActionForm from "../../components/Vault/VaultActionsForm/TreasuryActionsForm";
// import VaultInformation from "../../components/Deposit/VaultInformation";
// import { useWhitelist } from "../../hooks/useWhitelist";
// import { treasuryCopy } from "../../components/Product/treasuryCopies";


const ListContainer = styled.div`
  width: 100%;
  background-color: #F6F6F6;
  border-radius: 7px;
  padding: 30px;
  min-height: 135px;
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
  height: 90px;
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
  height: 135px;
  padding: 22px;
  border-radius: 2px;
  background-color: #FFFFFF;
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
  margin-right: 60px;
`

const AuctionTitle = styled.div`
  font-family: VCR;
  font-size: 24px;
  line-height: 20px;
  margin-bottom: 4px;
`

const DescriptionThin = styled.div`
  font-size: 13px;
  font-weight: 300;
`

const DescriptionThick = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
`

const InformationCaption = styled.div`
  font-size: 13px;
  font-weight: 300;
`

const InformationValue = styled.div`
  font-family: VCR;
  font-size: 15px;
  font-weight: 500;
  line-height: 16px;
`

const StackedAuctionInformation = styled.div`
  display: block;
  margin-left: auto;
`

const AuctionInformation = styled.div`
  display: flex;
  padding: 3px;
  color: #646464;
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
`

const ButtonContainer = styled.div`
  display: flex;
  margin-left: 50px;
`

const BidButtonContainer = styled.div`
  display: flex;
  margin-left: 160px;
  align-items: center;
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
  &:hover {
    opacity: ${theme.hover.opacity};
  }
`

const BidButton = styled.button`
  font-family: VCR;
  font-size: 20px; 
  color: #FFFFFF;
  background-color: #424242;
  border-radius: 5px;
  border: none;
  padding: 9px 20px 10px 20px;
  line-height: 20px;
  vertical-align: text-top;
  height: 41px;
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
  line-height: 42px;
  margin-bottom: 4px;
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
  margin-left: 5px;
  position: relative;
  width: 35px;
  height: 35px;
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

const OuterOuterCircle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: solid 1px rgba(0, 255, 71, 0.36);
  border-radius: 50%;
`

const Homepage = () => {
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


  // ### EMPTY PAGES ###
  // return (
  //   <>
  //     <ListTitle>Upcoming Auctions</ListTitle>
  //     <ListContainer>
  //       <EmptyDescriptionContainer>
  //         There are no upcoming auctions.
  //       </EmptyDescriptionContainer>
  //     </ListContainer>

  //     <ListTitle>History</ListTitle>
  //     <ListContainer>
  //       <EmptyDescriptionContainer>
  //         There are no past auctions.
  //       </EmptyDescriptionContainer>
  //     </ListContainer>
  //   </>
  // )

  return (
    <>
      <LiveContainer>
      <LiveTitleContainer>
        <LiveTitle>LIVE</LiveTitle>
        <IndicatorContainer>
          {/* <OuterOuterCircle>
            <OuterCircle>
              <InnerCircle></InnerCircle>
            </OuterCircle>
          </OuterOuterCircle> */}
          <Blob></Blob>
        </IndicatorContainer>
      </LiveTitleContainer>
      <LiveAuctionItemContainer>
          <LiveLogoContainer color={colors.asset.WETH}>
            <WETHLogo height="70px" width="70px"></WETHLogo>
          </LiveLogoContainer>
          <AuctionMainDescription>
            <LiveAuctionTitle>
              ETH-3300-07JAN22-PUT
            </LiveAuctionTitle>
            <DescriptionThin>
              Ending on:
            </DescriptionThin>
            <DescriptionThick>
              31 Jan 22, 19:15 UTC
            </DescriptionThick>
          </AuctionMainDescription>
          <StackedAuctionInformation>
          <AuctionInformation>
            <LiveInformationItem>
              <InformationCaption>Bid With: </InformationCaption>
              <InformationValue>WBTC</InformationValue>
            </LiveInformationItem>
            <Separator></Separator>
            <LiveInformationItem>
              <InformationCaption>Min. Bid (per oToken): </InformationCaption>
              <InformationValue>0.0035 WBTC</InformationValue>
            </LiveInformationItem>
          </AuctionInformation>
          <AuctionInformation>
            <LiveInformationItem>
              <InformationCaption>Size: </InformationCaption>
              <InformationValue>669 OTOKENS</InformationValue>
            </LiveInformationItem>
            <Separator></Separator>
            <LiveInformationItem>
              <InformationCaption>Current Price (per oToken): </InformationCaption>
              <InformationValue>0.0035 WBTC</InformationValue>
            </LiveInformationItem>
          </AuctionInformation>
          </StackedAuctionInformation>
          <BidButtonContainer>
            <BidButton>BID</BidButton>
          </BidButtonContainer>
        </LiveAuctionItemContainer>
      </LiveContainer>

      <ListTitle>Upcoming Auctions</ListTitle>
      <ListContainer>
        <AuctionItemContainer>
          <LogoContainer color={colors.asset.WETH}>
            <WETHLogo height="30px" width="30px"></WETHLogo>
          </LogoContainer>
          <AuctionMainDescription>
            <AuctionTitle>
              ETH-3300-07JAN22-PUT
            </AuctionTitle>
            <DescriptionThin>
              Scheduled Duration: 31 Jan 22, 19:00-19:15 UTC
            </DescriptionThin>
          </AuctionMainDescription>
          <AuctionInformation>
            <InformationItem>
              <InformationCaption>Starting In: </InformationCaption>
              <InformationValue>14 MINUTES</InformationValue>
            </InformationItem>
            <Separator></Separator>
            <InformationItem>
              <InformationCaption>Bid With: </InformationCaption>
              <InformationValue>WBTC</InformationValue>
            </InformationItem>
            <Separator></Separator>
            <InformationItem>
              <InformationCaption>Estimated Size: </InformationCaption>
              <InformationValue>669 OTOKENS</InformationValue>
            </InformationItem>
            <Separator></Separator>
            <InformationItem>
              <InformationCaption>Min. Bid (per oToken): </InformationCaption>
              <InformationValue>0.0035 WBTC</InformationValue>
            </InformationItem>
          </AuctionInformation>
          <ButtonContainer>
            <ViewButton>VIEW</ViewButton>
          </ButtonContainer>
        </AuctionItemContainer>
      </ListContainer>

      <ListTitle>Recent Auctions</ListTitle>
      <ListContainer>
      <AuctionItemContainer>
          <LogoContainer color={colors.asset.WETH}>
            <WETHLogo height="30px" width="30px"></WETHLogo>
          </LogoContainer>
          <AuctionMainDescription>
            <AuctionTitle>
              ETH-3300-07JAN22-PUT
            </AuctionTitle>
            <DescriptionThin>
              Concluded on: 31 Jan 22, 19:15 UTC
            </DescriptionThin>
          </AuctionMainDescription>
          <AuctionInformation>
            <InformationItem>
              <InformationCaption>No. Of Bids: </InformationCaption>
              <InformationValue>4</InformationValue>
            </InformationItem>
            <Separator></Separator>
            <InformationItem>
              <InformationCaption>Size: </InformationCaption>
              <InformationValue>669 OTOKENS</InformationValue>
            </InformationItem>
            <Separator></Separator>
            <InformationItem>
              <InformationCaption>Clearing Price (per oToken): </InformationCaption>
              <InformationValue>0.0035 WBTC</InformationValue>
            </InformationItem>
          </AuctionInformation>
          <ButtonContainer>
            <ViewButton>VIEW</ViewButton>
          </ButtonContainer>
        </AuctionItemContainer>
      </ListContainer>
    </>
  )
};

export default Homepage;

