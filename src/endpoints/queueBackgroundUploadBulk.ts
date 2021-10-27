import express from "express";
import { getBackgroundUploadQueue } from "../queue";
import { BackgroundUploadMessageDto } from "../types";
import { responses } from "../utilities";

interface DTO {
  urls: string[];
}

interface Response {
  [url: string]: number;
}

export const queueBackgroundUploadBulk = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<undefined | express.Response> => {
  try {
    if (req.readable) {
      return responses.badRequest(res, `Empty body`);
    }

    const dto = req.body as DTO;

    const response: Response = {};

    const workerQueue = getBackgroundUploadQueue();

    for (const url of dto.urls) {
      console.log(`queuing background upload of ${url}`);
      const message: BackgroundUploadMessageDto = {
        url,
      };
      const job = await workerQueue.add(message);

      console.log(`queued upload with job id ${job.id}`);

      response[url] = job.id as number;
    }

    await workerQueue.close();

    return responses.success(res, response);
  } catch (e) {
    next(e);
  }
};
