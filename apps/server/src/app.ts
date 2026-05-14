import express from "express"
import cors from "cors"
import audioRoutes from "./routes/audio.routes.js"
import webhookRoutes from "./routes/webhook.routes.js"
import morganMiddleware from "./logger/morgan.logger.js"
import { errorHandler } from "./middlewares/error.middlewares.js"

const app = express()

// Global Middlewares
app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(morganMiddleware)

// API Routes
app.use("/identify", audioRoutes)
app.use("/webhook", webhookRoutes)

// Global Error Handler (should be last)
app.use(errorHandler)

export default app
