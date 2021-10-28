import express from "express";
import { getCloudinaryUploadQueue } from "../queue";
import { CloudinaryUploadMessageDto } from "../types";
import { responses } from "../utilities";

interface DTO {
  url: string;
}

export const queueCloudinaryUpload = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<undefined | express.Response> => {
  try {
    const contents = req.body as DTO;
    if (!contents.url) {
      return responses.badRequest(
        res,
        "Body should be a json object with a field 'url' which is a string url to an IPFS file."
      );
    }

    const regexp = /(Qm[a-zA-Z0-9]{44})/g;
    const matches = regexp.exec(contents.url);
    if (!matches) {
      return responses.badRequest(res, "Url is not an IPFS file");
    }

    console.log(matches[0], matches[1]);

    const workQueue = getCloudinaryUploadQueue();
    const message: CloudinaryUploadMessageDto = {
      url: contents.url,
      hash: matches[1],
    };
    await workQueue.add(message);

    await workQueue.close();

    return responses.create(res, 200, {});
  } catch (e) {
    next(e);
  }
};
