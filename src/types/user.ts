export interface User {
    id: string,
    user_name: string,
    username?: string, // Keep this for backward compatibility
    email: string,
    createdAt?: string,
    updatedAt?: string
}

export interface LoginUserRequest {
    email: string, 
    password: string
}



export interface SignupUserRequest {
    user_name: string,
    email: string, 
    password: string, 
    confirmPassword?: string
}

export interface SignupUserResponseToSend {
    data:{
        user:User,
        token:string
    },
    message: string,
    success: boolean
}

export interface LoginUserResponseToSend {
    data:{
        user:User,
        token:string
    },
    message: string,
    success: boolean
}

export type GoogleLoginResponse = {
    data: {
      user: {
        id: string;
        user_name: string;
        email: string;
        created_at: string;
        updated_at: string;
      };
      token: string;
      is_new_user?: boolean;
    };
    message: string;
    success: boolean;
  };


export interface UserTokenPayload {
    user_id: string
    user_name: string
    email: string
    role?: "user" | "admin" | string
    iss?: string
    sub?: string
    aud?: string[]
    exp?: number
    nbf?: number
    iat?: number
    jti?: string
  }
  
export interface AboutUserResponse {
    data: UserTokenPayload
    message: string
    success: boolean
}

export interface UserStats {
    data: {
        auctions_created: number,
        total_bids: number,
        total_amount_bid: number,
        active_auctions?: number,
        participated_auctions:number,
        won_auctions:number,
        avg_bid_amount:number,
        highest_bid_placed:number,
    }
    message: string,
    success: boolean
}

export interface UserData {
    data: User,
}
export interface UserStatsData {
    data: UserStats,
}   