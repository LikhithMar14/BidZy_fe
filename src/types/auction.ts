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

export interface Bid {
    senderId: string;
    price: number;
    timestamp: string;
    userName?: string;
}

export interface AuctionResponse {
    ID: string;
    Title: string;
    Description: string;
    StartingPrice: number;
    CurrentPrice: number;
    highestBidder: string;
    ClientCount: number;
    isActive: boolean;
    Status: Status; 
    StartDate: string;
    EndDate: string;
    Increment: number;
    Image: string;
    user: User;
    categoryIds: number[];
    WinnerName: string;
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

export interface AuctionData {
    data: AuctionResponse[],
}   

export interface CreateAuctionRequest {
    title: string,
    description:string,
    startingPrice:number,
    increment:number,
    duration:number,
    userId:string,
    image:string,
    categoryIds: number[],
    startDateTime:string,
    endDateTime:string,
    status:Status,
}

export enum Category {
    ART = 1,
    COLLECTIBLES = 2,
    ELECTRONICS = 3,
    FASHION = 4,
    HOME = 5,
    OTHER = 6,
}

export interface ImageUploadRequest {
    fileName: string;
    contentType: string;
    auctionId: string;
}

export interface ImageUploadResponse {
    success: boolean;
    data: {
        uploadUrl: string;
        imageKey: string;
        imageUrl: string;
    };
}