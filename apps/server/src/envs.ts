import dotenv from "dotenv"
dotenv.config()

export const NODE_ENV = process.env.NODE_ENV || "development"
export const PORT = Number(process.env.PORT) || 3001
export const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/echo_shazam"
export const WORKER_API_URL = process.env.WORKER_API_URL || "http://localhost:8000/identify"
export const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"
