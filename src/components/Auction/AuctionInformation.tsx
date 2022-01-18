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
    chainId: number | undefined
    library: any
}> = ({
  data,
  bidData,
  chainId,
  library
}) => {
    // const { account, library, chainId} = useWeb3React()
    const priceFeed = useFetchAssetsPrice()
    const price = priceFeed.data[data.option.underlying.symbol as Assets].latestPrice.toFixed(2)
    const Logo = getAssetLogo(data.bidding.symbol as Assets)
    const logoSize = data.bidding.symbol == "WETH" || data.bidding.symbol == "WAVAX"
        ? "70px"
        : "90px"

    const color = getAssetColor(data.bidding.symbol as Assets)

    const title = data.option.symbol.split("/")[1]
    const extraInfo = title.split("-")[0]
    const [wstethPrice, setWstethPrice] = useState<BigNumber>();
    const [yvusdcPrice, setYvusdcPrice] = useState<BigNumber>();
    
    const wstethContract = useMemo(()=>{
      try {
        const address = getERC20TokenAddress("wsteth" as Assets, chainId!)
        return StETHFactory.connect(address, library.getSigner())
      } catch {
        return
      }
    }, [chainId, library])

    useEffect(() => {

      (async () => {
        try {
          setWstethPrice(await wstethContract!.stEthPerToken());
        } catch {}
      })();
    }, [wstethContract]);

    const timeLeft = ((Number(data.end)-moment().unix())%(60*60))
    const minute = Math.floor(timeLeft/60)
    const second = timeLeft%60

    const clock = useMemo(()=>{
      return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
    }, [minute, second])

    const yvusdcContract = useMemo(()=>{
      try {
        const address = getERC20TokenAddress("yvusdc" as Assets, chainId!)
        return YvUSDCFactory.connect(address, library.getSigner())
      } catch {
        return
      }
    }, [chainId, library])

    useEffect(() => {

      (async () => {
      try {
        setYvusdcPrice(await yvusdcContract!.pricePerShare());
      } catch {}
      })();
    }, [yvusdcContract]);

    const additionalInfo = useMemo(() => {
      if (wstethPrice && extraInfo == "wstETH") {
        return `1 wstETH = ${parseFloat(formatUnits(wstethPrice, 18)).toFixed(4)} ETH`
      } else if (yvusdcPrice && extraInfo == "yvUSDC") {
        return `1 yvUSDC = ${parseFloat(formatUnits(yvusdcPrice, 6)).toFixed(4)} USDC`
      } else {
        return
      }
    }, [wstethPrice, yvusdcPrice])

    const time = moment.unix(
      Number(data.option.expiry)).format("DD MMM YY, HH:mm [UTC]"
    )
    const size = parseFloat(
        ethers.utils.formatUnits(data.size, 8)
    ).toFixed(2)
    const filled = parseFloat(
        ethers.utils.formatUnits(BigNumber.from(data.filled).mul(10**8).div(data.size), 6)
    ).toFixed(0)

    const strike = parseFloat(ethers.utils.formatUnits(
      data.option.strike,
      8
    )).toFixed(2)
  
    
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

    const fixed = data.bidding.symbol == "USDC"
      ? 2 : 4

    const minBid = minBidPrice.toFixed(fixed)

    const highestBidPrice = Math.max(...bidData.map((value) => {
      return Number(
        ethers.utils.formatUnits(BigNumber.from(value.payable).mul(10**8).div(value.size), data.bidding.decimals)
      )
    }))

    const highestBid = useMemo(() => {
      return bidData.length > 0
        ? highestBidPrice.toFixed(2) + " " + data.bidding.symbol
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
                ? topInformationItem(
                    "Highest Bid (per oToken):", 
                    `${highestBid}`, color,
                  )
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

