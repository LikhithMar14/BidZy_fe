import { AuctionData, Bid } from "./auction";

export type MessageType = 'auction' | 'bid' | 'error' | 'ping' | 'pong' | 'count' | 'auction_data' | 'user_joined' | 'user_left' | 'bid_update' | 'success';


export type AuctionAction = 
| 'join' 
| 'leave' 
| 'place_bid' 
| 'current_bid' 
| 'bid_rejected' 
| 'bid_accepted' 
| 'get_auction_data' 
| 'auction_started' 
| 'auction_ended';

export interface WebSocketMessage {
    type: MessageType;
    action?: AuctionAction;
    auctionId: string;
    senderId?: string;
    biddingPrice?: number;
    content?: string;
    timestamp: string;
    count?: number;
    success?: boolean;
    data?: any;
    userName?: string;
  }

  export interface AuctionConnection {
    auctionId: string;
    token: string;
    userId: string;
    userName: string;
  }
  
  export interface BidResult {
    success: boolean;
    message: string;
    minRequired?: number;
  }
  export interface AuctionEvents {
    connected: (auctionId: string) => void;
    disconnected: (auctionId: string) => void;
    auctionData: (data: AuctionData) => void;
    bidUpdate: (bid: Bid) => void;
    userJoined: (userId: string) => void;
    userLeft: (userId: string) => void;
    error: (message: string) => void;
    success: (message: string) => void;
    countUpdate: (count: number) => void;
    auctionEnded: () => void;
  }
