import { BigNumber, ethers } from "ethers";
import {
  getAssetColor,
  getAssetLogo
} from "../../utils/asset"
import styled from "styled-components";
import { AuctionData, AugmentedBidData } from "../../models/auction";
import { Assets } from "../../store/types";
import moment from "moment";
import { decodeOrder } from "../../utils/order";
import { TimerIcon } from "../../assets/icons/icons";
import { useFetchAssetsPrice } from "../../hooks/fetchAssetPrice";
import { numberWithCommas } from "../../utils/text";
import { StETH } from "../../codegen";
import { StETHFactory } from "../../codegen/StETHFactory";
import { useWeb3React } from "@web3-react/core";
import { getERC20TokenAddress } from "../../constants/constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import { YvUSDCFactory } from "../../codegen/YvUSDCFactory";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useWeb3Context } from "../../hooks/web3Context";

const AuctionInformationContainer = styled.div`
  border-radius: 5px;
  background-color: #FFFFFF;
  border: solid 0.5px #D1D1D1;
  margin-bottom: 20px;
`

const MainInformation = styled.div`
  display: flex;
  height: 125px;
  padding: 17px;
  width: 100%;
  border-bottom: solid 1px #D1D1D1;
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

const Description = styled.div`
  display: block;
  margin-right: 20px;
`

const Schedule = styled.div`
  font-size: 20px;
  font-weight: 300;
`

const TopCaption = styled.div`
  font-size: 16px;
  font-weight: 300;
  text-align: center;
`

const TopValue = styled.div<{color: string}>`
  font-family: VCR;
  font-size: 24px;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  color: ${(props) => props.color};
`

const Caption = styled.div`
  font-size: 15px;
  font-weight: 300;
  text-align: center;
`

const Value = styled.div`
  font-family: VCR;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  margin-top: -7px;
`

const Timer = styled.div`
  display: flex;
  height: 100px;
  font-family: VCR;
  font-size: 30px;
  text-align: center;
  align-items: center;
  margin-top: 6px;
`

const TimerText = styled.div<{color: string}>`
  margin-top: -2px;
  margin-left: 10px;
  color: ${(props) => props.color};
`

const TopAuctionInformation = styled.div`
  display: flex;
  padding: 3px;
  align-items: center;
  margin-left: auto;
`

const TopInformation = styled.div`
  display: block;
  min-width: 100px;
  margin-bottom: 6px;
  margin-left: 60px;
`

const DetailItem = styled.div`
  display: block;
  flex: 1 1 0;
  width: auto;
  padding: 10px;
`

const Title = styled.div`
  font-family: VCR;
  font-size: 30px;
  margin-top: 4px;
  margin-bottom: -5px;
`

const DetailsContainer = styled.div`
  display: flex;
  & > * {
    border-right: solid 1px #D1D1D1;

    &:last-child {
        border-right: unset;
    }
  }
`

const AdditionalCapsule = styled.div<{color: string}>`
  display: table;
  font-family: VCR;
  border-radius: 10px;
  background-color: ${(props) => props.color}20;
  margin: 7px auto 0px auto;
  font-size: 12px;
  color: ${(props) => props.color};
  padding: 3px 12px;
  font-weight: 500;
`

const AuctionInformation: React.FC<{
    data: AuctionData
    bidData: AugmentedBidData[]
    additionalInfo: string | undefined
}> = ({
  data,
  bidData,
  additionalInfo
}) => {
    // const { account, library, chainId} = useWeb3React()
    const priceFeed = useFetchAssetsPrice()
    const price = priceFeed.data[data.option.underlying.symbol as Assets].latestPrice.toFixed(2)
    const Logo = getAssetLogo(data.bidding.symbol as Assets)
    const logoSize = data.bidding.symbol == "WETH" || data.bidding.symbol == "WAVAX"
        ? "70px"
        : "90px"

    const color = getAssetColor(data.bidding.symbol as Assets)
    const { provider } = useWeb3Context();
    const title = data.option.symbol.split("/")[1]
    const extraInfo = title.split("-")[0]

    const timeLeft = ((Number(data.end)-moment().unix())%(60*60))
    const minute = Math.floor(timeLeft/60)
    const second = timeLeft%60

    const clock = useMemo(()=>{
      return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
    }, [minute, second])

    const time = moment.unix(
      Number(data.option.expiry)).format("DD MMM YY, HH:mm [UTC]"
    )
    const size = parseFloat(
        ethers.utils.formatUnits(data.size, 8)
    ).toFixed(2)
    

    const strike = parseFloat(ethers.utils.formatUnits(
      data.option.strike,
      8
    )).toFixed(2)
      
    
    let prices:BigNumber[] = []
    
    const clear = useMemo(()=>{
      return bidData.map((value) => {
        return {
          ...value,
          price: BigNumber.from(value.payable).mul(10**8).div(value.size),
          size: BigNumber.from(value.size)}
      }).sort((a, b) => {
        return Number(b.price.sub(a.price))
        })
    }, [bidData])

    let availableSize = BigNumber.from(data.size)

    const clearFind = useMemo(()=>{

      return clear.map((value) => {
        const oTokenQuantity = value.size.lt(availableSize)
          ? value.size
          : availableSize

        availableSize = availableSize.sub(oTokenQuantity)
        if (oTokenQuantity.gt(0)) prices.push(value.price)
          
        return {
          ...value,
          allocated: oTokenQuantity
        }
      })
    },[clear])

    const priceDiscovery = useMemo(()=>{
      const discovery = prices.map((currentPrice) => {
        let availableSize = BigNumber.from(data.size)

        const adjusted = clearFind.map((value) => {
          const newSize = currentPrice.lte(value.price)
            ? BigNumber.from(value.payable).mul(10**8).div(currentPrice)
            : BigNumber.from(0)

          const oTokenQuantity = newSize.lt(availableSize)
            ? newSize
            : availableSize

          availableSize = availableSize.sub(oTokenQuantity)
            
          return {
            ...value,
            allocated: oTokenQuantity.toString(),
            size: value.size.toString()
          }
        })

        return {
          clearing: currentPrice,
          adjustedBids: availableSize.gt(0)
            ? undefined
            : adjusted
        }
      })

      return discovery.filter((value)=>{
        return value.adjustedBids
      }).pop()
    },[])

    

    const filledPercent = useMemo(()=>{
      return BigNumber.from(data.size).sub(availableSize).mul(10**6).div(data.size)
    }, [])

    

    // const price
    
    useEffect(()=>{
      // console.log(availableSize.toString())
      // console.log(clearFind)
      // console.log(lastHighest.toString())
      // console.log(priceDiscovery.filter((value)=>{
      //   return value.winningBids
      // }).pop())
      console.log(priceDiscovery)
      console.log(filledPercent.toString())
    }, [])

    let clearing = "-"
    try {
      const clearingOrder = decodeOrder(data.clearing)

      const clearingPrice = parseFloat(ethers.utils.formatUnits(
          clearingOrder.sellAmount
          .mul(10**8)
          .div(clearingOrder.buyAmount)
          , data.bidding.decimals.toString())
      )
    
      clearing = data.bidding.symbol == "USDC"
          ? clearingPrice.toFixed(2)
          : clearingPrice.toFixed(4)
    } catch {
    }
    
    
    const minBidPrice = parseFloat(
        ethers.utils.formatUnits(
            BigNumber.from(data.minimum)
                .mul(10**8)
                .div(data.size)
        , data.bidding.decimals.toString())
    )

    const live = data.live
    
    if (priceDiscovery) {
      clearing = live ? parseFloat(
        ethers.utils.formatUnits(priceDiscovery.clearing, data.bidding.decimals)
        ).toFixed(2)
        : clearing
    }
    
    const filled = !live 
      ? parseFloat(
        ethers.utils.formatUnits(BigNumber.from(data.filled).mul(10**8).div(data.size), 6)
      ).toFixed(0)
      : parseFloat(
        ethers.utils.formatUnits(filledPercent, 4)
      ).toFixed(0)

    const fixed = data.bidding.symbol == "USDC"
      ? 2 : 4

    const minBid = minBidPrice.toFixed(fixed)

    const highestBidPrice = Math.max(...bidData.map((value) => {
      return Number(
        ethers.utils.formatUnits(BigNumber.from(value.payable).mul(10**8).div(value.size), data.bidding.decimals)
      )
    }))

    const highestBid = useMemo(() => {
      return bidData.length > 0 && clearing != "-"
        ? clearing + " " + data.bidding.symbol
        : "-"
    }, [bidData, data])


    const topInformationItem = (
      caption: string, 
      value: string,
      color: string,
      info?: string,
    ) => {
      return (
        <TopInformation>
          <TopCaption>{caption} </TopCaption>
          <TopValue color={color}>{value}</TopValue>
          {info
            ?<AdditionalCapsule color={color}>{info}</AdditionalCapsule>
            :<></>}
        </TopInformation>
      )
    }

    const DetailComponent: React.FC<{
        caption: string
        value: string
    }> = ({
      caption,
      value
    }) => {
      return (
        <DetailItem>
          <Caption>{caption}</Caption>
          <Value>{value}</Value>
        </DetailItem>
      )
    }

  return (
    <>
      <AuctionInformationContainer>
        <MainInformation>
          <LogoContainer color={color}>
            <Logo height={logoSize} width={logoSize} backgroundColor="none"></Logo>
          </LogoContainer>
          <Description>
            <Title>
              {title}
            </Title>
            <Schedule>
              Expiry: {time}
            </Schedule>
          </Description>
          <TopAuctionInformation>
              {live
                ? (<>
                    {topInformationItem(
                    "Clearing Price (per oToken):", 
                    highestBid, color)}
                    {topInformationItem(
                      "Filled:", filled + "%", color
                    )}
                  </>)
                : (<>
                    {topInformationItem(
                      "Clearing Price (per oToken):", 
                      `${clearing} ${data.bidding.symbol}`, 
                      color, additionalInfo
                    )}
                    {topInformationItem(
                      "Filled:", filled + "%", color
                    )}
                  </>)
              }
            <TopInformation>
                <Timer>
                    <TimerIcon color={color} height="25px" width="25px"></TimerIcon>
                    <TimerText color={color}>
                        {live
                            ? clock
                            :  Number(data.end) < moment().unix()
                                ? "CLOSED"
                                : "--:--"
                        }
                    </TimerText>
                </Timer>
            </TopInformation>
          </TopAuctionInformation>
        </MainInformation>
        <DetailsContainer>
          <DetailComponent 
            caption="Size (oTokens):" 
            value={numberWithCommas(size)}>  
          </DetailComponent>
          <DetailComponent 
            caption="Min. Bid (per oToken):" 
            value={minBid + " " + data.bidding.symbol}>
          </DetailComponent>
          <DetailComponent 
            caption="Strike Price:" 
            value={"$"+numberWithCommas(strike)}>  
          </DetailComponent>
          <DetailComponent 
            caption="Current Spot Price:" 
            value={"$"+numberWithCommas(price)}>
          </DetailComponent>
          <DetailComponent 
            caption="Underlying Token:" 
            value={data.option.underlying.symbol}>
          </DetailComponent>
          <DetailComponent 
            caption="Bidding Token:" 
            value={data.bidding.symbol}>  
          </DetailComponent>
        </DetailsContainer>
      </AuctionInformationContainer>
    </>
  )
};

export default AuctionInformation;

