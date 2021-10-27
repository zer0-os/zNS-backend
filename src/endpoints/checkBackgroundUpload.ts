import express from "express";
import { getBackgroundUploadQueue } from "../queue";
import { BackgroundUploadMessageDto } from "../types";
import { responses } from "../utilities";

interface DTO {
  jobId: number | string;
}

interface Response {
  attemptsMade: number;
  progress: any;
  data: any;
  isCompleted: boolean;
  result: any;
  error: any;
  failed: boolean;
}

export const checkBackgroundUpload = async (
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
    const job = await workerQueue.getJob(dto.jobId);

    if (!job) {
      return responses.badRequest(res, `Invalid job id`);
    }

    const isCompleted = await job.isCompleted();

    const response: Response = {
      attemptsMade: job.attemptsMade,
      progress: job.progress(),
      data: job.data,
      isCompleted,
      result: isCompleted ? await job.finished() : undefined,
      error: job.failedReason,
      failed: await job.isFailed(),
    };

    return responses.success(res, response);
  } catch (e) {
    next(e);
  }
};
