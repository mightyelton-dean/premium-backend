import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

interface Config {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  COOKIE_EXPIRES_IN: number;
  FRONTEND_URL: string;
  // Add new configs:
  MAX_FILE_UPLOAD: number;
}

function parsePort(port: string | undefined, defaultPort: number): number {
  const parsed = parseInt(port || "", 10);
  return isNaN(parsed) ? defaultPort : parsed;
}

function parseMaxFileUpload(
  max: string | undefined,
  defaultMax: number
): number {
  const parsed = parseInt(max || "", 10);
  return isNaN(parsed) ? defaultMax : parsed;
}

const config: Config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parsePort(process.env.PORT, 4000),
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "90d",
  COOKIE_EXPIRES_IN:
    parseInt(process.env.COOKIE_EXPIRES_IN || "90") * 24 * 60 * 60 * 1000,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  MAX_FILE_UPLOAD: parseMaxFileUpload(
    process.env.MAX_FILE_UPLOAD,
    50 * 1024 * 1024
  ), // 50MB default
};

export default config;
export const {
  NODE_ENV,
  PORT,
  MONGO_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  COOKIE_EXPIRES_IN,
  FRONTEND_URL,
  MAX_FILE_UPLOAD,
} = config;