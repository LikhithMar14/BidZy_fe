export interface User {
    id: string,
    username: string,
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