import bodyParser from "body-parser";
import express from "express";
import rateLimit from "express-rate-limit";
import * as endpoints from "./endpoints";
import { responses } from "./utilities";

export const apiRouter = express.Router();

// User will receive a 429 error for being rate limited
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // Window size
  max: 50, // limit each IP to X requests per windowMs
});

// apiRouter.use(bodyParser.raw({
//   limit: "10mb",
//   type: "*/*"
// } as bodyParser.Options));

apiRouter.post("/upload", limiter, endpoints.upload);
