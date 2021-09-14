import express from "express";
import { isProduction } from "../utilities";

export function notFound(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

export function errorHandler(
  err: Error,
  req: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: express.NextFunction
): void {
  console.error(`Unhandled ${err.name} Error: ${err.message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: isProduction() ? undefined : err.stack,
  });
}
