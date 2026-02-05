import jwt from 'jsonwebtoken'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'default-access-secret'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default-refresh-secret'
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m'
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d'

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  console.warn('⚠️  JWT secrets not configured in .env. Using defaults (development only)');
} 

export interface TokenPayload {
    userId: string
    email: string
}

export interface JwtTokens {
    accessToken: string
    refreshToken: string
}

// Generating both access token and refresh token

export const generateTokens = (payload: TokenPayload): JwtTokens => {
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET as string, {
        expiresIn: ACCESS_TOKEN_EXPIRY as any
    })

    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET as string, {
        expiresIn: REFRESH_TOKEN_EXPIRY as any
    })

    return{
        accessToken,
        refreshToken
    }
} 

// Verifying accessToken

export const verifyAccessToken = (token: string): TokenPayload | null => {
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET as string) as TokenPayload
        return decoded
    } catch (err){
        return null
    }
}

// Verifying refreshtoken

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET as string) as TokenPayload;
    return decoded
  } catch (error) {
    return null
  }
}

// Extracting token from Authorization header

export const extractTokenFromHeader = (authHeader:string | undefined): string | null => {
    if(!authHeader) return null

    const parts = authHeader.split(' ')
    if(parts.length !==2 || parts[0] !== 'Bearer') {
        return null
    }

    return parts[1] ?? null 
}