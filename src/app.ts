import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middleware/errorMiddleware";
import { corsOptions } from "./config/cors";
import { rateLimiter } from "./config/rateLimiter";
import apiRoutes from "./routes";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors(corsOptions));
    this.app.use(mongoSanitize());
    this.app.use(hpp());
    this.app.use(compression());
    this.app.use(express.json({ limit: "10kb" }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    if (process.env.NODE_ENV === "development") {
      this.app.use(morgan("dev"));
    }

    this.app.use("/api", rateLimit(rateLimiter));
  }

  private initializeRoutes() {
    this.app.use("/api/v1", apiRoutes);
  }

  private initializeErrorHandling() {
    this.app.use(globalErrorHandler);
  }
}

export default new App().app;
