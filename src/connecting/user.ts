import { api } from "@/lib/api";
import { AuctionResponse } from "@/types/auction";
import { Bid } from "@/types/bids";
import { User, UserStats } from "@/types/user";

export const getUserInfo = async(): Promise<User | undefined>  => {
    try {
        console.log('🔍 Fetching user info...');
        const response = await api.get('/users')
        console.log('✅ User info response:', response.data);
        return response.data as User

    }catch(err:any) {   
        console.error(`❌ Error while getting user info:`, err.response?.data?.message || err.message)
        throw new Error(err.response?.data?.message || err.message)
    }
}

export const getAuctionsOfUser = async(): Promise<AuctionResponse[] | undefined> => {
    try {
        console.log('🔍 Fetching user auctions...');
        const response = await api.get('/users/auctions')
        console.log('✅ User auctions response:', response.data);
        return response.data as AuctionResponse[]
    }catch(err:any) {
        console.error(`❌ Error while getting auctions of an user:`, err.response?.data?.message || err.message)
        throw new Error(err.response?.data?.message || err.message)
    }
}

export const getBidsOfUser = async(): Promise<Bid[] | undefined> => {
    try {
        console.log('🔍 Fetching user bids...');
        const response = await api.get('/users/bids')
        console.log('✅ User bids response:', response.data);
        return response.data as Bid[]
    }catch(err:any) {
        console.error(`❌ Error while getting bids of an user:`, err.response?.data?.message || err.message)
        throw new Error(err.response?.data?.message || err.message)
    }
}

export const getUserStats = async(): Promise<UserStats | undefined> => {
    try {
        console.log('🔍 Fetching user stats...');
        const response = await api.get('/users/stats')
        console.log('✅ User stats response:', response.data);
        return response.data as UserStats
    }catch(err:any) {
        console.error(`❌ Error while getting stats of an user:`, err.response?.data?.message || err.message)
        throw new Error(err.response?.data?.message || err.message)
    }
}


export const getParticipatedAuctions = async(): Promise<AuctionResponse[] | undefined> => {
    try {
        console.log('🔍 Fetching participated auctions...');
        const response = await api.get('/users/participated-auctions')
        console.log('✅ Participated auctions response:', response.data);
        return response.data as AuctionResponse[]
    }catch(err:any) {
        console.error(`❌ Error while getting participated auctions of an user:`, err.response?.data?.message || err.message)
        throw new Error(err.response?.data?.message || err.message)
    }
}