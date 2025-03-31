import { config } from 'dotenv'

config()

export const PORT = process.env.PORT || 3000
export const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost'
export const MYSQL_USER = process.env.MYSQL_USER || 'root'
export const MYSQL_DB = process.env.MYSQL_DB || 'herobytedb'
export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || ''
export const MYSQL_PORT = process.env.MYSQL_PORT || 3306
export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
export const JWT_SECRET = process.env.JWT_SECRET
export const SESSION_SECRET = process.env.SESSION_SECRET
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET