import express from "express";
import { getBackgroundUploadQueue } from "../queue";
import { BackgroundUploadMessageDto } from "../types";
import { responses } from "../utilities";

interface DTO {
  url: string;
}

interface Response {
  jobId: number | string;
}

export const queueBackgroundUpload = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<undefined | express.Response> => {
  try {
    if (req.readable) {
      return responses.badRequest(res, `Empty body`);
    }

    const dto = req.body as DTO;
    const workerQueue = getBackgroundUploadQueue();
    const message: BackgroundUploadMessageDto = {
      url: dto.url,
    };
    const jobId = await workerQueue.add(message);

    const response: Response = {
      jobId: jobId.id,
    };

    return responses.success(res, response);
  } catch (e) {
    next(e);
  }
};
