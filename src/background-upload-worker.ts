// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import { getBackgroundUploadQueue } from "./queue";
import { BackgroundUploadMessageDto } from "./types";
import * as cloudinary from "cloudinary";
import * as env from "env-var";
import * as http from "https";
import throng from "throng";
import fleekStorage, {
  streamUploadInput,
  streamUploadOutput,
} from "@fleekhq/fleek-storage-js";

const maxJobsPerWorker = env.get("WORKER_JOBS").default(2).asIntPositive();
const workers = env.get("NUM_WORKERS").default(2).asIntPositive();

const fleekAuth = () => {
  return {
    apiKey: env.get(`FLEEK_STORAGE_API_KEY`).required().asString(),
    apiSecret: env.get(`FLEEK_STORAGE_API_SECRET`).required().asString(),
  };
};

const defaultBucket = process.env.FLEEK_BUCKET;
const fleekPrefix = process.env.FLEEK_PREFIX;

function start() {
  const workQueue = getBackgroundUploadQueue();

  workQueue.process(maxJobsPerWorker, async (job, done) => {
    const message = job.data as BackgroundUploadMessageDto;

    try {
      console.log(`Attempting to upload ${message.url} to IPFS`);

      await job.progress("uploading to IPFS");
      const finished = new Promise<streamUploadOutput>(
        async (resolve, reject) => {
          http.get(message.url, async (res) => {
            console.log(`streaming data from ${message.url} to fleek`);
            const uploadRequest = {
              ...fleekAuth(),
              key: `${fleekPrefix}backgroundupload-job-${job.id}`,
              bucket: defaultBucket,
              stream: res,
            };
            try {
              const file = await fleekStorage.streamUpload(
                uploadRequest as any
              );
              resolve(file);
            } catch (e) {
              console.error(e);
              done(Error(`Failed ${e}`));
              reject(`Failed to upload to Fleek ${e}`);
            }
          });
        }
      );

      const ipfsUpload = await finished;

      await job.progress("uploading to cloudinary");

      const tryUploadType = async (type: "video" | "image") => {
        await cloudinary.v2.uploader.upload_url({
          public_id: ipfsUpload.hash,
          folder: env.get("CLOUDINARY_FOLDER").asString(),
          resource_type: type,
        });
      };

      try {
        await tryUploadType("video");
        console.log(`finished uploading ${message.url}`);
      } catch (e) {
        console.error(`Failed to upload ${message.url} as video`);
        try {
          await tryUploadType("image");
        } catch (e) {
          console.error(`Failed to upload ${message.url} as image!`);
          done(Error(`Failed to upload to cloudinary.`));
        }
      }

      await job.progress("completed");

      const ipfsGateway = `https://ipfs.fleek.co/ipfs/`;

      done(undefined, {
        url: `${ipfsGateway}${ipfsUpload.hashV0}`,
        hash: ipfsUpload.hashV0,
      });
    } catch (e) {
      done(Error(`Failed ${e}`));
    }
  });
}

throng({ workers, start });
