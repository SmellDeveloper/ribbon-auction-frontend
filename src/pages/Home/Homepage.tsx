import { useWeb3React } from "@web3-react/core";
import React, { ReactNode, useMemo } from "react";
import { useHistory } from "react-router";
import AuctionItem from "../../components/Auction/AuctionItem"
import styled, { keyframes } from "styled-components";
import useFetchSubgraphData from "../../hooks/useFetchSubgraphData";
import useTextAnimation from "../../components/Common/useTextAnimation";
import LiveAuctionItem from "../../components/Auction/LiveAuctionItem";

const ListContainer = styled.div`
  width: 100%;
  background-color: #F6F6F6;
  border-radius: 7px;
  padding: 30px;
  min-height: 135px;
  margin-bottom: 40px;

  & > * {
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: unset;
    }
  }
`
const ListTitle = styled.div`
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 500;
`

const EmptyDescriptionContainer = styled.div`
  font-family: VCR;
  text-transform: uppercase;
  font-size: 14px;
  display: flex;
  color: #8E8E8E;
  height: 75px;
  justify-content: center;
  align-items: center;
`

const Homepage = () => {
  const { active } = useWeb3React();
  const history = useHistory();
  const { responses, loading } = useFetchSubgraphData();

  responses.sort((a, b) => {
    return Number(a.end) - Number(b.end)
  })
  
  // const liveAuction = responses.filter((value) => {
  //   return value.live
  // })

  const liveAuction = responses[0]

  const loadingText = useTextAnimation()

  return (
    <>
      {!loading
        ? <LiveAuctionItem data={liveAuction}></LiveAuctionItem>
        : <></>
      }

      <ListTitle>Upcoming Auctions</ListTitle>
      <ListContainer>
      {!loading
          ? responses.slice(0,5).reverse().map((data) => {

            return (
              <AuctionItem 
                variant="upcoming"
                data={data}
              ></AuctionItem>
            )
          })
          : <EmptyDescriptionContainer>{loadingText}</EmptyDescriptionContainer>
        }
      </ListContainer>

      <ListTitle>Recent Auctions</ListTitle>
      <ListContainer>
        {!loading
          ? responses.reverse().map((data) => {

            return (
              <AuctionItem 
                variant="concluded"
                data={data}
              ></AuctionItem>
            )
          })
          : <EmptyDescriptionContainer>{loadingText}</EmptyDescriptionContainer>
        }
      </ListContainer>
    </>
  )
};

export default Homepage;

