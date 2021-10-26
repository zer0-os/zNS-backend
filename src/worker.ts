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

    const finished = new Promise(async (resolve, reject) => {
      const request = http.get(message.ipfsFile.publicUrl);

      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          public_id: message.ipfsFile.ipfsHash,
          folder: env.get("CLOUDINARY_FOLDER").asString(),
          resource_type: "video",
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

      request.pipe(uploadStream);
    });

    await finished;
  });
}

throng({ workers, start });
