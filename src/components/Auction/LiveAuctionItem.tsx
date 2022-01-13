import { BigNumber, ethers } from "ethers";
import {
  getAssetColor,
  getAssetLogo
} from "../../utils/asset"
import styled from "styled-components";
import theme from "../../design/theme";
import { AuctionData } from "../../models/auction";
import { Assets } from "../../store/types";
import moment from "moment";
import { decodeOrder } from "../../utils/order";
import LiveIndicator from "../Indicator/Live";
import { AnimatePresence, motion } from "framer-motion";
import { ActionButton } from "../Common/Button";

const LiveAuctionItemContainer = styled.div`
  display: flex;
  height: 135px;
  padding: 22px;
  border-radius: 2px;
  background-color: #FFFFFF;
`

const LogoContainer = styled.div<{ color: string }>`
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

const MainDescription = styled.div`
  display: block;
  margin-right: 60px;
`

const AuctionTimeCaption = styled.div`
  font-size: 13px;
  font-weight: 300;
`

const AuctionTime = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
`

const Caption = styled.div`
  font-size: 13px;
  font-weight: 300;
`

const Value = styled.div`
  font-family: VCR;
  font-size: 15px;
  font-weight: 500;
  line-height: 16px;
`

const StackedDetailDescription = styled.div`
  display: block;
  margin-left: auto;
`

const DetailDescription = styled.div`
  display: flex;
  padding: 3px;
  color: #646464;
  align-items: center;
  margin-left: auto;
`

const InformationGroup = styled.div`
  display: block;
  min-width: 100px;
  margin-bottom: 5px;
`

const ButtonContainer = styled.div`
  display: flex;
  margin-left: 160px;
  align-items: center;
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

const LiveAuctionOuterContainer = styled(motion.div)`
  background-color: #E9FFF6;
  width: calc(100% + 2*30px);
  border-radius: 7px;
  padding: 15px 30px 30px 30px;
  margin: 0px -30px;
  min-height: 165px;
  margin-bottom: 40px;
`

const AuctionTitle = styled.div`
  font-family: VCR;
  font-size: 34px;
  line-height: 42px;
  margin-bottom: 4px;
`

const Title = styled.div`
    font-size: 20px;
    font-weight: 500;
`

const TitleContainer = styled.div`
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


const LiveAuctionItem: React.FC<{
    data: AuctionData
  }> = ({
    data
  }) => {
    const Logo = getAssetLogo(data.bidding.symbol as Assets)
    const logoSize = data.bidding.symbol == "WETH"
      ? "70px"
      : "85px"
  
    const color = getAssetColor(data.bidding.symbol as Assets)
    const title = data.option.symbol.split("/")[1]
    const time = moment.unix(Number(data.end)).format("DD MMM YY, HH:mm [UTC]")
    const size = parseFloat(
      ethers.utils.formatUnits(data.size, 8)
    ).toFixed(0)
    const filled = parseFloat(
      ethers.utils.formatUnits(BigNumber.from(data.filled).mul(10**8).div(data.size), 6)
    ).toFixed(0)
    const clearingOrder = decodeOrder(data.clearing)
  
    const clearingPrice = parseFloat(ethers.utils.formatUnits(
      clearingOrder.sellAmount
        .mul(10**8)
        .div(clearingOrder.buyAmount)
      , data.bidding.decimals.toString())
    )

    const minBidPrice = parseFloat(
        ethers.utils.formatUnits(
            BigNumber.from(data.minimum)
                .mul(10**8)
                .div(data.size)
        , data.bidding.decimals.toString())
    )
  
    const clearing = data.bidding.symbol == "USDC"
      ? clearingPrice.toFixed(2)
      : clearingPrice.toFixed(4)

    const minBid = data.bidding.symbol == "USDC"
    ? minBidPrice.toFixed(2)
    : minBidPrice.toFixed(4)

    const link = "/auction/" + data.id
        + "-" + title.split("-")[0]
        + "-" + title.split("-")[1]
        + "-" + title.split("").pop()


  return (
    <AnimatePresence>
        <LiveAuctionOuterContainer
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 0, opacity: 0 }}
        transition={{
          duration: 0.4,
          type: "keyframes",
          ease: "easeInOut",
        }}>
        <TitleContainer>
            <Title>LIVE</Title>
            <IndicatorContainer>
            <LiveIndicator></LiveIndicator>
            </IndicatorContainer>
        </TitleContainer>
        <LiveAuctionItemContainer>
            <LogoContainer color={color}>
                <Logo height={logoSize} width={logoSize}></Logo>
            </LogoContainer>
            <MainDescription>
                <AuctionTitle>
                {title}
                </AuctionTitle>
                <AuctionTimeCaption>
                Ending on:
                </AuctionTimeCaption>
                <AuctionTime>
                {time}
                </AuctionTime>
            </MainDescription>
            <StackedDetailDescription>
            <DetailDescription>
                <InformationGroup>
                    <Caption>Bid With: </Caption>
                    <Value>{data.bidding.symbol}</Value>
                </InformationGroup>
                <Separator></Separator>
                <InformationGroup>
                    <Caption>Min. Bid (per oToken): </Caption>
                    <Value>{minBid} {data.bidding.symbol}</Value>
                </InformationGroup>
            </DetailDescription>
            <DetailDescription>
                <InformationGroup>
                    <Caption>Size: </Caption>
                    <Value>{size} OTOKENS</Value>
                </InformationGroup>
                <Separator></Separator>
                <InformationGroup>
                    <Caption>Current Price (per oToken): </Caption>
                    <Value>0.0035 {data.bidding.symbol}</Value>
                </InformationGroup>
            </DetailDescription>
            </StackedDetailDescription>
            <ButtonContainer>
                <ActionButton link={link} children="BID"></ActionButton>
            </ButtonContainer>
            </LiveAuctionItemContainer>
        </LiveAuctionOuterContainer>
    </AnimatePresence>
  )
};

export default LiveAuctionItem;

