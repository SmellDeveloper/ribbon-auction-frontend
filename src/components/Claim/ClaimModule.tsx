import { useWeb3React } from "@web3-react/core";
import { useCallback } from "react";
import styled from "styled-components";
import theme from "../../design/theme";
import useVaultActionForm from "../../hooks/useVaultActionForm";
import useAuction from "../../hooks/useVault";
import { AugmentedAuctionData, AugmentedBidData } from "../../models/auction";

const EmptyDescriptionContainer = styled.div`
  font-size: 14px;
  display: flex;
  color: #8E8E8E;
  height: 140px;
  justify-content: center;
  align-items: center;
`

const BidButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
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
  border: solid 1px #C1C1C1;
  width: 100%;
  height: 50px;
  padding: 10px;
  font-size: 24px;
  text-align: center;
  
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
  
  const { account } = useWeb3React();
  const {
    auctionActionForm
  } = useVaultActionForm(auctionData.id);

  const gnosisContract = useAuction()

  const handleClaimOrder = useCallback(async () => {
    if (gnosisContract) {
      console.log(bidData)
      const bidBytes = bidData.map((value) => {
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
    }
  }, [gnosisContract, auctionActionForm, bidData]);

  const disable = bidData.length > 0
   return disable ? (
   <BiddingModal>
    <InputBlock>
      <InputCaption>OTOKEN WON</InputCaption>
      <Input disabled={true}
            type="number"
            className="form-control"
            aria-label="payable"
            placeholder="0"
          ></Input>
      <InputCaption>{auctionData.bidding.symbol} CLAIMABLE</InputCaption>
      <Input disabled={true}
            type="number"
            className="form-control"
            aria-label="payable"
            placeholder="0"
          ></Input>
    </InputBlock>
    <BidButtonContainer>
      <BidButton onClick={handleClaimOrder}>CLAIM</BidButton>
    </BidButtonContainer>
  </BiddingModal>) 
  : <EmptyDescriptionContainer>Auction has concluded.</EmptyDescriptionContainer>
};

export default ClaimModule;

