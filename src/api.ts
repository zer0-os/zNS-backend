import express from "express";
import rateLimit from "express-rate-limit";
import * as endpoints from "./endpoints";

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
apiRouter.post("/uploadCloudinary", limiter, endpoints.uploadAndCloudinary);
apiRouter.post("/uploadVideo", limiter, endpoints.optimizedCloudinaryUpload);
apiRouter.post("/uploadV2", limiter, endpoints.uploadV2);
