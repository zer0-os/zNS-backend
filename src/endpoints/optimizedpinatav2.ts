import express from "express";
import { CloudinaryUploadMessageDto, Maybe } from "../types";
import { getBodyAsBuffer } from "./helpers";
const DelayedResponse = require("http-delayed-response");

import * as pinata from "../pinata";
import * as env from "env-var";
import { getCloudinaryUploadQueue } from "../queue";

const pinataApiKey = env.get("PINATA_API_KEY").required().asString();
const pinataApiSecret = env.get("PINATA_API_SECRET").required().asString();

const ipfsGateway = env
  .get("IPFS_GATEWAY")
  .default("https://ipfs.io/ipfs/")
  .asString();

export const optimizedpinatav2 = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const delayed = new DelayedResponse(req, res, next);

    const upload = async (callback: any) => {
      let contents: Maybe<Buffer | string>;

      let isJson = false;

      if (req.readable) {
        contents = await getBodyAsBuffer(req, res, "100mb");
      } else {
        contents = JSON.stringify(req.body);
        isJson = true;
      }

      if (contents.length === 0) {
        callback("no body");
        return;
      }

      if (isJson && typeof contents == "string") {
        const pinnedFile = await pinata.pinJSONToIPFS(
          pinataApiKey,
          pinataApiSecret,
          contents
        );
        const response = {
          hash: pinnedFile.IpfsHash,
          url: `${ipfsGateway}${pinnedFile.IpfsHash}`,
        };

        return callback(undefined, response);
      } else {
        const pinnedFile = await pinata.pinFileToIPFS(
          pinataApiKey,
          pinataApiSecret,
          contents,
          req.headers["content-type"]!
        );

        const response = {
          hash: pinnedFile.IpfsHash,
          url: `${ipfsGateway}${pinnedFile.IpfsHash}`,
        };

        const workQueue = getCloudinaryUploadQueue();
        const message: CloudinaryUploadMessageDto = response;
        await workQueue.add(message);

        return callback(undefined, response);
      }
    };

    delayed.json();

    delayed.on("error", (e: any) => {
      console.log(e);
      console.log(`delayed error`);
      res.end();
    });

    upload(delayed.start(1000, 20000));
  } catch (e) {
    next(e);
  }
};
