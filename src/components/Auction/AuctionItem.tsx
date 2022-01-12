import { BigNumber, ethers } from "ethers";
import {
  getAssetColor,
  getAssetLogo
} from "../../utils/asset"
import styled from "styled-components";
import theme from "../../design/theme";
import { useCallback, useMemo } from "react";
import { AuctionData } from "../../models/auction";
import { Assets } from "../../store/types";
import moment from "moment";
import { decodeOrder } from "../../utils/order";
import { ActionButton } from "../Common/Button";

const AuctionItemContainer = styled.div`
  display: flex;
  height: 75px;
  padding: 17px;
  border-radius: 2px;
  background-color: #FFFFFF;
`

const LogoContainer = styled.div<{ color: string }>`
  height: 40px;
  min-width: 40px;
  margin-right: 12px;
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

const AuctionTitle = styled.div`
  font-family: VCR;
  font-size: 24px;
  line-height: 20px;
  margin-bottom: 4px;
`

const AuctionSchedule = styled.div`
  font-size: 13px;
  font-weight: 300;
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

const DetailDescription = styled.div`
  display: flex;
  padding: 3px;
  color: #646464;
  align-items: center;
  margin-left: auto;

  & > * {
    &:nth-last-child(3) {
      width: 120px;
    }
  }
`

const InformationGroup = styled.div`
  display: block
`

const ButtonContainer = styled.div`
  display: flex;
  margin-left: 50px;
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

const Separator = styled.div`
  width: 1px;
  height: 20px;
  background-color: #D3D3D3;
  margin: 0px 20px;
`

const AuctionItem: React.FC<{
  variant: string
  data: AuctionData
}> = ({
  variant,
  data
}) => {
  const Logo = getAssetLogo(data.bidding.symbol as Assets)
  const logoSize = data.bidding.symbol == "WETH"
    ? "30px"
    : "40px"

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

  const clearing = data.bidding.symbol == "USDC"
    ? clearingPrice.toFixed(2)
    : clearingPrice.toFixed(4)

  const minBidPrice = parseFloat(
    ethers.utils.formatUnits(
        BigNumber.from(data.minimum)
            .mul(10**8)
            .div(data.size)
    , data.bidding.decimals.toString())
  )
  
  const link = "/auction/" + data.id
    + "-" + title.split("-")[0]
    + "-" + title.split("-")[1]
    + "-" + title.split("").pop()

  const minBid = data.bidding.symbol == "USDC"
    ? minBidPrice.toFixed(2)
    : minBidPrice.toFixed(4)
  
  const scheduleText = useCallback(() => {
    switch(variant) {
      case "concluded":
        return "Concluded on"
      case "upcoming":
        return "Scheduled Duration"
      default:
        return ""
    }
  }, []);

  const AuctionDetails = useMemo(() => {
    switch(variant) {
      case "concluded":
        return (
          <DetailDescription>
            <InformationGroup>
              <Caption>Filled: </Caption>
              <Value>{filled}%</Value>
            </InformationGroup>
            <Separator></Separator>
            <InformationGroup>
              <Caption>Size: </Caption>
              <Value>{size} OTOKENS</Value>
            </InformationGroup>
            <Separator></Separator>
            <InformationGroup>
              <Caption>Clearing Price (per oToken): </Caption>
              <Value>{clearing} {data.bidding.symbol}</Value>
            </InformationGroup>
          </DetailDescription>
        )
      case "upcoming":
        return (
          <DetailDescription>
            <InformationGroup>
              <Caption>Starting In: </Caption>
              <Value>14 MINUTES</Value>
            </InformationGroup>
            <Separator></Separator>
            <InformationGroup>
              <Caption>Bid With: </Caption>
              <Value>{data.bidding.symbol}</Value>
            </InformationGroup>
            <Separator></Separator>
            <InformationGroup>
              <Caption>Estimated Size: </Caption>
              <Value>{size} OTOKENS</Value>
            </InformationGroup>
            <Separator></Separator>
            <InformationGroup>
              <Caption>Min. Bid (per oToken): </Caption>
              <Value>{minBid} {data.bidding.symbol}</Value>
            </InformationGroup>
          </DetailDescription>
        )
      default:
        return <></>
    }
  }, [])

  return (
    <>
      <AuctionItemContainer>
          <LogoContainer color={color}>
            <Logo height={logoSize} width={logoSize} backgroundColor="none"></Logo>
          </LogoContainer>
          <MainDescription>
            <AuctionTitle>
              {title}
            </AuctionTitle>
            <AuctionSchedule>
              {scheduleText()}: {time.toString()}
            </AuctionSchedule>
          </MainDescription>
          {AuctionDetails}
          <ButtonContainer>
            <ActionButton link={link} children="VIEW"></ActionButton>
          </ButtonContainer>
        </AuctionItemContainer>
    </>
  )
};

export default AuctionItem;

