import { api } from "@/lib/api"
import { AuctionRequest, AuctionResponse, ImageUploadRequest, ImageUploadResponse } from "@/types/auction"
import { Bid, BidData } from "@/types/bids"




const transformAuctionData = (apiAuction: any): AuctionResponse => {
    // Enhanced winner name extraction - check multiple possible fields
    const winnerName = apiAuction.WinnerName || 
                      apiAuction.winnerName || 
                      apiAuction.winner_name ||
                      apiAuction.winner?.name ||
                      apiAuction.winner?.user_name ||
                      apiAuction.winner?.userName ||
                      (apiAuction.highestBidder && apiAuction.highestBidderName) ||
                      '';

    return {
        ID: apiAuction.auctionId || apiAuction.ID,
        Title: apiAuction.title || apiAuction.Title,
        Description: apiAuction.description || apiAuction.Description,
        StartingPrice: apiAuction.startingPrice || apiAuction.StartingPrice,
        CurrentPrice: apiAuction.currentPrice || apiAuction.CurrentPrice,
        highestBidder: apiAuction.highestBidder || apiAuction.highestBidder || '',
        ClientCount: apiAuction.clientCount || apiAuction.ClientCount || 0,
        isActive: apiAuction.isActive !== undefined ? apiAuction.isActive : (apiAuction.status === 'ACTIVE'),
        Status: apiAuction.status || apiAuction.Status,
        StartDate: apiAuction.startTime || apiAuction.StartDate,
        EndDate: apiAuction.endTime || apiAuction.EndDate,
        Increment: apiAuction.increment || apiAuction.Increment,
        Image: apiAuction.image || apiAuction.Image,
        user: apiAuction.user || apiAuction.user,
        categoryIds: apiAuction.categoryIds || apiAuction.categoryIds || [],
        WinnerName: winnerName,
        participants: apiAuction.participants || apiAuction.participants || [],
    };
};

export const getAllAuctions = async (): Promise<AuctionResponse[] | undefined> => {
    try {
        const response  = await api.get('/auctions')

        

        const responseData = response.data as any
        let auctionsData = [];
        
        if (responseData && responseData.data) {
            auctionsData = responseData.data;
        } else if (Array.isArray(responseData)) {
            auctionsData = responseData;
        } else {
            auctionsData = [responseData];
        }
        
        
        const transformedAuctions = auctionsData.map(transformAuctionData);

        
        return transformedAuctions;
    }catch (err:any) {
        console.log(`Error getting all auctions: ${err.response?.data?.message || err.message}`)
        throw new Error(err.response?.data?.message || err.message)
    }
}

export const createAuction = async (auction: AuctionRequest): Promise<AuctionResponse | undefined> => {
    try {
        const response = await api.post('/auctions', auction)
        
        const responseData = response.data as any
        if (responseData && responseData.data) {
            return responseData.data as AuctionResponse
        }
        return responseData as AuctionResponse
    }catch (err:any) {
        console.log(`Error creating auction: ${err.response.data.message}`)
        throw new Error(err.response.data.message)
    }
}



export const getImageUploadUrl = async (request: ImageUploadRequest): Promise<ImageUploadResponse> => {
    try {
        const response = await api.post('/upload/auction-image', request)
        return response.data as ImageUploadResponse
    } catch (err: any) {
        console.log(`Error getting image upload URL: ${err.response?.data?.message || err.message}`)
        throw new Error(err.response?.data?.message || 'Failed to get upload URL')
    }
}

export const uploadImageToS3 = async (uploadUrl: string, file: File): Promise<void> => {
    try {
        await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        })
    } catch (err: any) {
        console.log(`Error uploading image to S3: ${err.message}`)
        throw new Error('Failed to upload image')
    }
}

export const getAuctionById = async (auctionId: string): Promise<AuctionResponse | undefined> => {
    try {
        const response = await api.get(`/auctions/${auctionId}`)

        
        const responseData = response.data as any
        let auctionData;
        
        if (responseData && responseData.data) {
            auctionData = responseData.data;
        } else {
            auctionData = responseData;
        }
        
        
        const transformedAuction = transformAuctionData(auctionData);

        
        return transformedAuction;
    } catch (err: any) {
        console.log(`Error getting auction by ID: ${err.response?.data?.message || err.message}`)
        throw new Error(err.response?.data?.message || 'Failed to get auction details')
    }
}


export const getAuctionBidsDataLive = async (auctionId: string): Promise<Bid[] | undefined> => {
    try {
        console.log("HITTING BIDS DATA LIVE......")
        const response = await api.get(`/bids/${auctionId}/timeline`)
        const bidData = response.data as BidData
        
        if (bidData.success && bidData.data) {
            return bidData.data
        }
        return []
    } catch (err: any) {
        console.log(`Error getting auction bids data live: ${err.response?.data?.message || err.message}`)
        throw new Error(err.response?.data?.message || 'Failed to get auction bids data live')
    }
}