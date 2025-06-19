import { api } from "@/lib/api"
import { AuctionRequest, AuctionResponse } from "@/types/auction"


export const getAllAuctions = async (): Promise<AuctionResponse[] | undefined> => {
    try {
        const response  = await api.get('/auctions')
        return response.data as AuctionResponse[]
    }catch (err:any) {
        console.log(`Error getting all auctions: ${err.response.data.message}`)
        throw new Error(err.response.data.message)
    }
}

export const createAuction = async (auction: AuctionRequest): Promise<AuctionResponse | undefined> => {
    try {
        const response = await api.post('/auctions', auction)
        return response.data as AuctionResponse
    }catch (err:any) {
        console.log(`Error creating auction: ${err.response.data.message}`)
        throw new Error(err.response.data.message)
    }
}