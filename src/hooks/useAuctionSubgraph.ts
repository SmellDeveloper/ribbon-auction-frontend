export const AuctionGraphql = () => {
  return (
    `auctions: auctions {
      id
      option {
        id
        address
        name
        symbol
        decimals
        expiry
        strike
        underlying {
          id
          address
          name
          symbol
          decimals
        }
        put
      }
      bidding {
        id
        address
        name
        symbol
        decimals
      }
      minimum
      size
      start
      end
      bids
      filled
      clearing
      spot
      live
    }`
  )
}

export const BidsGraphql = (auctionId: string) => {
  return (
    `bids: bids (where: {auction: ${auctionId}}) {
      id
      index
      auction
      account {
        id
      }
      size
      payable
      createtx
      claimtx
      canceltx
      bytes
    }`
  )
}

export default AuctionGraphql
