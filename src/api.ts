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
apiRouter.post(
  "/uploadCloudinary",
  limiter,
  endpoints.optimizedCloudinaryUpload
);
apiRouter.post("/v1/uploadCloudinary", limiter, endpoints.uploadAndCloudinary);
apiRouter.post("/uploadVideo", limiter, endpoints.optimizedCloudinaryUpload);
apiRouter.post("/queueCloudinary", limiter, endpoints.queueCloudinaryUpload);
apiRouter.post("/uploadV2", limiter, endpoints.uploadV2);
apiRouter.post("/longupload", limiter, endpoints.optimizedv2);
apiRouter.post("/longuploadv2", limiter, endpoints.optimizedpinatav2);

apiRouter.post("/background/start", limiter, endpoints.queueBackgroundUpload);
apiRouter.post(
  "/background/startBulk",
  limiter,
  endpoints.queueBackgroundUploadBulk
);
apiRouter.post("/background/check", limiter, endpoints.checkBackgroundUpload);
apiRouter.post(
  "/background/checkBulk",
  limiter,
  endpoints.checkBackgroundUploadBulk
);
