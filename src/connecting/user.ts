import { api } from "@/lib/api";
import { AuctionData } from "@/types/auction";
import { BidData } from "@/types/bids";
import { UserData, UserStats } from "@/types/user";

export const getUserInfo = async(): Promise<UserData | undefined>  => {
    try {
        const response = await api.get('/users')
        return response.data as UserData

    }catch(err:any) {   
        console.log(`Error while getting user info ${err.response.data.message}`)
        throw new Error(err.response.data.message)
    }
}

export const getAuctionsOfUser = async(): Promise<AuctionData | undefined> => {
    try {
        const response = await api.get('/users/auctions')
        return response.data as AuctionData
    }catch(err:any) {
        console.log(`Error while getting auctions of an user ${err.response.data.message}`)
        throw new Error(err.response.data.message)
    }
}

export const getBidsOfUser = async(): Promise<BidData | undefined> => {
    try {
        const response = await api.get('/users/bids')
        return response.data as BidData
    }catch(err:any) {
        console.log(`Error while getting bids of an user ${err.response.data.message}`)
        throw new Error(err.response.data.message)
    }
}

export const getUserStats = async(): Promise<UserStats | undefined> => {
    try {
        const response = await api.get('/users/stats')
        return response.data as UserStats
    }catch(err:any) {
        console.log(`Error while getting stats of an user ${err.response.data.message}`)
        throw new Error(err.response.data.message)
    }
}


export const getParticipatedAuctions = async(): Promise<AuctionData | undefined> => {
    try {
        const response = await api.get('/users/participated-auctions')
        return response.data as AuctionData
    }catch(err:any) {
        console.log(`Error while getting participated auctions of an user ${err.response.data.message}`)
        throw new Error(err.response.data.message)
    }
}