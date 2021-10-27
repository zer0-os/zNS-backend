import express from "express";
import { CloudinaryUploadMessageDto, Maybe } from "../types";
import { responses } from "../utilities";
import { getBodyAsBuffer } from "./helpers";

import * as pinata from "../pinata";
import * as env from "env-var";
import { getCloudinaryUploadQueue } from "../queue";
import { Readable } from "stream";

const pinataApiKey = env.get("PINATA_API_KEY").required().asString();
const pinataApiSecret = env.get("PINATA_API_SECRET").required().asString();

const ipfsGateway = env
  .get("IPFS_GATEWAY")
  .default("https://ipfs.io/ipfs/")
  .asString();

export const uploadV2 = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<undefined | express.Response> => {
  try {
    let contents: Maybe<Buffer | string>;

    let isJson = false;

    if (req.readable) {
      contents = await getBodyAsBuffer(req, res, "100mb");
    } else {
      contents = JSON.stringify(req.body);
      isJson = true;
    }

    if (contents.length === 0) {
      return responses.badRequest(res, `Empty body`);
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

      return responses.success(res, response);
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

      return responses.success(res, response);
    }
  } catch (e) {
    if (e.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(e.response.data);
    }
    next(e);
  }
};
