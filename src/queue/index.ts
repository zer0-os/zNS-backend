import * as env from "env-var";
import Queue = require("bull");

const redisUrl = () => {
  const url = env.get("REDIS_URL").default("redis://127.0.0.1:6379").asString();
  return url;
};

export const getCloudinaryUploadQueue = () => {
  const url = redisUrl();
  const workerQueue = new Queue("cloudinary", url);
  return workerQueue;
};

export const getBackgroundUploadQueue = () => {
  const url = redisUrl();
  const workerQueue = new Queue(
    env.get("BACKGROUND_QUEUE").default("background").asString(),
    {
      redis: {
        port: env.get("REDIS_PORT").required().asInt(),
        host: env.get("REDIS_HOST").required().asString(),
        password: env.get("REDIS_PW").required().asString(),
        username: env.get("REDIS_USER").required().asString(),
      },
    }
  );
  return workerQueue;
};
