import app from "./app";
import logger from "./utils/logger";
import connectDB from "./config/db";

// Connect to MongoDB
connectDB();
console.log("Starting server...");

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}...`);
});

process.on("unhandledRejection", (err: Error) => {
  logger.error("UNHANDLED REJECTION! Shutting down...");
  logger.error(err.name, err.message);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! Shutting down...");
  logger.error(err.name, err.message);
  process.exit(1);
});
