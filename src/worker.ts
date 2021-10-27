// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import { getCloudinaryUploadQueue } from "./queue";
import { CloudinaryUploadMessageDto } from "./types";
import * as cloudinary from "cloudinary";
import * as env from "env-var";
import * as http from "https";
import throng from "throng";

const maxJobsPerWorker = env.get("WORKER_JOBS").default(2).asIntPositive();
const workers = env.get("NUM_WORKERS").default(2).asIntPositive();

function start() {
  const workQueue = getCloudinaryUploadQueue();

  workQueue.process(maxJobsPerWorker, async (job) => {
    const message = job.data as CloudinaryUploadMessageDto;

    console.log(`Attempting to upload ${message.hash} to Cloudinary`);

    const tryUploadType = async (type: "video" | "image") => {
      const finished = new Promise(async (resolve, reject) => {
        http.get(message.url, (res) => {
          if (res.statusCode !== 200) {
            reject(`Invalid response`);
          }

          const uploadStream = cloudinary.v2.uploader.upload_stream(
            {
              public_id: message.hash,
              folder: env.get("CLOUDINARY_FOLDER").asString(),
              resource_type: type,
            },
            (err, res) => {
              if (err) {
                reject(err);
                return;
              }

              if (!res) {
                reject(new Error("no response"));
                return;
              }

              resolve(res);
            }
          );

          res.pipe(uploadStream);
        });
      });

      await finished;
    };

    try {
      await tryUploadType("video");
      console.log(`finished uploading ${message.hash}`);
    } catch (e) {
      console.error(`Failed to upload ${message.hash} as video`);
      try {
        await tryUploadType("image");
      } catch (e) {
        console.error(`Failed to upload ${message.hash} as image!`);
      }
    }
  });
}

throng({ workers, start });
