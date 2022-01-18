import styled from "styled-components";
import { formatUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { AugmentedAuctionData, AugmentedBidData } from "../../models/auction";

const EmptybidDataText = styled.div`
  font-size: 14px;
  display: flex;
  color: #8E8E8E;
  height: 40px;
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

const BidInformationCaption = styled.div`
  font-family: VCR;
  margin-bottom: 13px;
  color: #464646;
  font-size: 20px;
  line-height: 16px;
  font-weight: 600;

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

export const BidInformationPage: React.FC<{
    auctionData: AugmentedAuctionData
    bidData: AugmentedBidData[]
}> = ({
  auctionData,
  bidData
}) => {

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
    return (
        (
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
            {bidData.length > 0
            ? bidData.sort((a, b) => {
                return Number(a.index) - Number(b.index)
                }).map((bid, index) => {
                const quantity = parseFloat(formatUnits(
                    BigNumber.from(bid.size), 8
                )).toFixed(2)
                const payable = parseFloat(formatUnits(
                    BigNumber.from(bid.payable), auctionData.bidding.decimals.toString()
                )).toFixed(4)
                const price = parseFloat(formatUnits(
                    BigNumber.from(bid.payable).mul(10**8).div(bid.size), auctionData.bidding.decimals.toString()
                )).toFixed(4)
                
                return renderBid(index+1, quantity, price, payable, auctionData.bidding.symbol)
                })
            : <EmptybidDataText>You have not made any bids.</EmptybidDataText>
            }
        </BidHistoryBlock>
        </BidInformation>
        )
    )
};

export default BidInformationPage;

