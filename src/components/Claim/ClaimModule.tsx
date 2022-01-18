import { useWeb3React } from "@web3-react/core";
import { useCallback } from "react";
import styled from "styled-components";
import theme from "../../design/theme";
import useVaultActionForm from "../../hooks/useVaultActionForm";
import useAuction from "../../hooks/useAuction";
import { AugmentedAuctionData, AugmentedBidData } from "../../models/auction";
import { impersonateAddress } from "../../utils/development";
import { decodeOrder } from "../../utils/order";
import { BigNumber, ethers } from "ethers";
import { numberWithCommas } from "../../utils/text";

const EmptyDescriptionContainer = styled.div`
  font-size: 14px;
  display: flex;
  color: #8E8E8E;
  height: 140px;
  justify-content: center;
  align-items: center;
`

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`

const ClaimButton = styled.button<{color: string}>`
  font-family: VCR;
  font-size: 15px; 
  color: ${(props) => props.color};
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

  & > * {

    &:nth-last-child(2) {
        margin-top: 25px;
    }
  }
`

const InputCaption = styled.div`
  display: flex;
  font-family: VCR;
  justify-content: center;
  background-color: #FFFFFF;
  border-radius: 5px;
  margin-bottom: 5px;
  color: #464646;
  font-size: 14px;
  font-weight: 600;
`

const Input = styled.input`
  font-family: VCR;
  border-radius: 5px;
  border: solid 1px #16CEB9;
  color: #167a6e;
  width: 100%;
  height: 50px;
  padding: 10px;
  font-size: 24px;
  text-align: center;

  &:disabled {
    background-color: #16CEB920;
  }

  &::placeholder {
    opacity: 0.2; 
  }
`


const ClaimModule: React.FC<{
    auctionData: AugmentedAuctionData
    bidData: AugmentedBidData[]
}> = ({
    auctionData,
    bidData
}) => {
  
  const { account: acc } = useWeb3React();
  const account = impersonateAddress ? impersonateAddress : acc;
  const {
    auctionActionForm
  } = useVaultActionForm(auctionData.id);

  const gnosisContract = useAuction()

  const clearingOrder = decodeOrder(auctionData.clearing)

  const clearingPrice = 
      clearingOrder.sellAmount
      .mul(10**8)
      .div(clearingOrder.buyAmount)

  let availableSize = BigNumber.from(auctionData.size)

  const bidsWithPrice = bidData.map((value) => {
    const implied_price = BigNumber.from(value.payable).mul(10**8).div(value.size)
    const win = implied_price >= clearingPrice
    return {...value, win: win, price: implied_price}
  }) 

  bidsWithPrice.sort((a, b) => {
    return parseInt(ethers.utils.formatUnits(b.price.sub(a.price), 8))
  })

  const winningBids = bidsWithPrice.map((value) => {
    const oTokenQuantity = value.win 
      ? BigNumber.from(Math.min(Number(value.size), Number(availableSize)))
      : BigNumber.from(0)
    availableSize = availableSize.sub(oTokenQuantity)
    const biddingQuantity = value.win
      ? BigNumber.from(value.payable).sub(oTokenQuantity.mul(clearingPrice).div(10**8))
      : BigNumber.from(value.payable)

    return {...value, otokenClaim: oTokenQuantity, bidClaim: biddingQuantity}
  })

  const accountBids = winningBids.filter((value)=>{
    return value.account.id == account && value.win
  })

  const unclaimedBids = accountBids.filter((value)=>{
    return !value.claimtx && !value.canceltx
  })

  const oTokenClaimable = accountBids.reduce((sum: BigNumber, a) => sum.add(a.otokenClaim), BigNumber.from(0)); 
  const biddingClaimable = accountBids.reduce((sum: BigNumber, a) => sum.add(a.bidClaim), BigNumber.from(0)); 
  
  const enable = accountBids.length > 0
  const claimed = unclaimedBids.length == 0

  const handleClaimOrder = useCallback(async () => {
    if (gnosisContract) {
      const bidBytes = unclaimedBids.map((value) => {
        return value.bytes
      })
      try {
        const tx = await gnosisContract.claimFromParticipantOrder(
          auctionActionForm.auctionId,
          bidBytes,
        )
      } catch {}
    }
  }, [gnosisContract, auctionActionForm, unclaimedBids]);

   return enable ? (
   <BiddingModal>
    <InputBlock>
      <InputCaption>OTOKEN WON</InputCaption>
      <Input disabled={true}
            type="text"
            className="form-control"
            aria-label="payable"
            value={numberWithCommas(parseFloat(ethers.utils.formatUnits(oTokenClaimable, 8)).toFixed(2))}
            placeholder="0"
          ></Input>
      <InputCaption>{auctionData.bidding.symbol} CLAIMABLE</InputCaption>
      <Input disabled={true}
            type="text"
            className="form-control"
            aria-label="payable"
            value={numberWithCommas(
              parseFloat(ethers.utils.formatUnits(biddingClaimable, auctionData.bidding.decimals)).toFixed(2))
            }
            placeholder="0"
          ></Input>
    </InputBlock>
    <ButtonContainer>
      <ClaimButton color={claimed ? "#16CEB9":"#FFFFFF"} disabled={claimed} onClick={handleClaimOrder}>
        {claimed ? "CLAIMED" : "CLAIM"}
      </ClaimButton>
    </ButtonContainer>
  </BiddingModal>) 
  : <EmptyDescriptionContainer>Auction has concluded.</EmptyDescriptionContainer>
};

export default ClaimModule;

