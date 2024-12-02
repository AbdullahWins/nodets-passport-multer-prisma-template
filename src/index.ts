// src/index.ts
import express, { Application } from "express";
import { startServer } from "./configs";
import { checkImageExists, globalMiddleware } from "./middlewares";
import { globalErrorHandler } from "./utilities";
import { apiRouter } from "./routers/main/routes";
import { metricsRouter, notFoundRouter } from "./routers";

export const app: Application = express();

// middleware
globalMiddleware(app);

// all routes
app.use("/api/v1", apiRouter);

// files route
// TODO: Uncomment the line below to enable the checkImageExists middleware after fixing "files with spaces in the name resorts to not found" issue
app.use("/public", checkImageExists, express.static("public"));
// app.use("/public", express.static("public"));

// metrics route
app.use("/metrics", metricsRouter);

// global error handler
app.use(globalErrorHandler);

// not found route
app.use(notFoundRouter);

// server & database
startServer(app);
