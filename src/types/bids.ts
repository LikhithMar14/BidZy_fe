export interface Bid {
    bid_id: string,
    amount: number,
    created_at: string,
    bidder: string,
}

export interface BidData {
    data: Bid[],
    message: string,
    success: boolean,
}

// Legacy bid interface for WebSocket compatibility
export interface LegacyBid {
    id: string,
    amount: number,
    createdAt?: string,
    senderId: string,
    auctionId: string,
    bidderName: string,
}

