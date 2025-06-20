import { api } from "@/lib/api"
import { AuctionRequest, AuctionResponse, ImageUploadRequest, ImageUploadResponse } from "@/types/auction"


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

