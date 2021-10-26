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

    console.log(
      `Attempting to upload ${message.ipfsFile.ipfsHash} to Cloudinary`
    );

    const finished = new Promise(async (resolve, reject) => {
      http.get(message.ipfsFile.publicUrl, (res) => {
        if (res.statusCode !== 200) {
          reject(`Invalid response`);
        }

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

        res.pipe(uploadStream);
      });
    });

    try {
      await finished;
      console.log(`finished uploading ${message.ipfsFile.ipfsHash}`);
    } catch (e) {
      console.error(
        `Failed to upload video to cloudinary ${message.ipfsFile.ipfsHash}`
      );
      console.error(e);
    }
  });
}

throng({ workers, start });
