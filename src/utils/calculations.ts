import { BigNumber } from "ethers";
import { AuctionData, BidData } from "../models/auction";

export function findClearingPrice(auctionData: AuctionData, bidData: BidData[]){
    let prices: BigNumber[] = []
    const size = BigNumber.from(auctionData.size)
    let remainingSize = size

    const addPrice = bidData.map((value) => {
        return {
            ...value,
            price: BigNumber.from(value.payable).mul(10**8).div(value.size)}
        }
    )

    addPrice.sort((a, b) => {
        return Number(a.index) - Number(b.index)
    })

    addPrice.sort((a, b) => {
        return a.price.lt(b.price) ? 1 : -1
    })

    const fillSize = addPrice.map((value) => {

        const bidSize = BigNumber.from(value.size)
        const initialOtokenSize =  value.canceltx
            ? BigNumber.from(0)
            : bidSize.lt(remainingSize)
                ? bidSize
                : remainingSize

        remainingSize = remainingSize.sub(initialOtokenSize)

        if (initialOtokenSize.gt(0)) prices.push(value.price)
            
        return {
            ...value,
            allocation: initialOtokenSize
        }
    })

    const priceDiscovery = prices.map((currentPrice) => {
        let remainingSize = size
        let price = currentPrice
        let payableContainer = BigNumber.from(0)
        let modified = 0

        const discovery = fillSize.map((value) => {
            const newSize = currentPrice.lte(value.price)
                ? BigNumber.from(value.payable).mul(10**8).div(currentPrice)
                : BigNumber.from(0)

            const finalOtokenSize = value.canceltx
                ? BigNumber.from(0)
                : newSize.lt(remainingSize)
                    ? newSize
                    : remainingSize

            remainingSize = remainingSize.sub(finalOtokenSize)

            if (finalOtokenSize.gt(0)) {
                payableContainer = payableContainer.add(value.payable)
            }

            if (currentPrice.eq(value.price) && finalOtokenSize.eq(0)) {
                price = payableContainer.mul(10**8).div(size)
                modified = 1
            }
            
            return {
                ...value,
                allocation: finalOtokenSize.toString(),
                size: value.size.toString(),
            }
        })

        if (!remainingSize.eq(0)) {
            price = payableContainer.mul(10**8).div(size)
            modified = 1
        }

        return {
            auction: auctionData.id,
            clearing: price,
            filled: size.sub(remainingSize),
            bids: discovery,
            modified: modified
        }
    })

    

    priceDiscovery.sort((a, b) => {
        return b.clearing.lt(a.clearing) ? 1 : -1
    })

    priceDiscovery.sort((a, b) => {
        return b.modified - a.modified
    })

    priceDiscovery.sort((a, b) => {
        return a.filled.lt(b.filled) ? 1 : -1
    })

    return {
        auction: priceDiscovery[0].auction,
        filled: priceDiscovery[0].filled,
        clearing: priceDiscovery[0].clearing.toString()
    }
}


export function evaluateBids(auctionData: AuctionData, bidData: BidData[], clearing: string) {
    const size = BigNumber.from(auctionData.size)
    const clearingPrice = BigNumber.from(clearing)
    let remainingSize = size

    const addPrice = bidData.map((value) => {
        return {
            ...value,
            price: BigNumber.from(value.payable).mul(10**8).div(value.size)}
        }
    )

    addPrice.sort((a, b) => {
        return Number(a.index) - Number(b.index)
    })

    addPrice.sort((a, b) => {
        return a.price.lt(b.price) ? 1 : -1
    })


    const adjusted = addPrice.map((value) => {

        const newSize = clearingPrice.lte(value.price)
            ? BigNumber.from(value.payable).mul(10**8).div(clearingPrice)
            : BigNumber.from(0)

        const finalOtokenSize = value.canceltx
            ? BigNumber.from(0)
            : newSize.lt(remainingSize)
                ? newSize
                : remainingSize

        remainingSize = remainingSize.sub(finalOtokenSize)

        const reimburse = BigNumber.from(value.payable).mul(10**8).sub(clearingPrice.mul(finalOtokenSize)).div(10**8)

        return {
            ...value,
            allocation: finalOtokenSize.toString(),
            reimburse: reimburse.toString()
        }
    })

    return {
        auction: auctionData,
        clearing: clearing,
        bids: adjusted
    }
}