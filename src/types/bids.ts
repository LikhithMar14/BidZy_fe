export interface Bid {
    id: string,
    amount:number,
    createdAt?:string,
    senderId:string,
    auctionId:string,
    bidderName:string,
}

export interface BidData {
    data: Bid[],
}

