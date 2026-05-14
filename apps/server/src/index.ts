import app from "./app.js"
import { initDb } from "./lib/db.js"
import { PORT } from "./envs.js"
import logger from "./logger/winston.logger.js"

/**
 * Start the Express server and initialize dependencies.
 */
async function startServer() {
  try {
    // 1. Initialize the database schema
    await initDb()

    // 2. Start listening for requests
    app.listen(PORT, () => {
      logger.info(`🚀 Echo Server running at http://localhost:${PORT}`)
    })
  } catch (error) {
    logger.error("Failed to start server:", error)
    process.exit(1)
  }
}

// Bootstrap the application
startServer()
