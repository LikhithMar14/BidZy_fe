import { User } from "./user";

export enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    ENDED = 'ENDED',
    CANCELLED = 'CANCELLED',
  }
  

export interface Participant {
    id: string,
    user_name: string,
    email: string,
    created_at?:string,
    updated_at?:string
}

export interface AuctionResponse {
    auctionId: string;
    title: string;
    description: string;
    startingPrice: number;
    currentPrice: number;
    highestBidder: string;
    clientCount: number;
    isActive: boolean;
    status: Status; 
    startTime: string;
    endTime: string;
    increment: number;
    image: string;
    user: User;
    categoryIds: number[];
    participants: Participant[];
}


export interface AuctionRequest {
    title: string;
    description: string;
    startingPrice: number;
    increment: number;
    duration: number; 
    userId: string;
    image: string;
    categoryIds: number[];
    //should be sent in utc time format
    startDateTime: string; 
    endDateTime: string;   
    status: Status; 
}