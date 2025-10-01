import { httpServer } from "./app.js";
import logger from "./utils/logger.js";
import sequelize, { umzugSeeding } from "./config/db.js";

const PORT = process.env.PORT || 8000;

// Start HTTP server immediately so Render detects it
httpServer.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server running on port ${PORT}`);
});

// Connect to DB asynchronously
(async () => {
  try {
    await sequelize.authenticate();
    logger.info("Successfully connected to the database");

    // Run seeders
    await umzugSeeding.up();
    logger.info("Database seeding complete");

  } catch (err) {
    logger.error("Error connecting to the database: " + err.message);
    // Do not exit here; server is already listening
  }
})();
