import express from "express";
import { getBackgroundUploadQueue } from "../queue";
import { BackgroundUploadMessageDto } from "../types";
import { responses } from "../utilities";

interface DTO {
  jobIds: number[];
}

interface JobData {
  attemptsMade: number;
  progress: any;
  data: any;
  isCompleted: boolean;
  result: any;
  error: any;
  failed: boolean;
}

interface Response {
  [jobId: number]: JobData;
}

export const checkBackgroundUploadBulk = async (
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

    const response: Response = {};

    for (const jobId of dto.jobIds) {
      const job = await workerQueue.getJob(jobId);

      if (!job) {
        return responses.badRequest(res, `Invalid job id`);
      }

      const isCompleted = await job.isCompleted();

      const jobData: JobData = {
        attemptsMade: job.attemptsMade,
        progress: job.progress(),
        data: job.data,
        isCompleted,
        result: isCompleted ? await job.finished() : undefined,
        error: job.failedReason,
        failed: await job.isFailed(),
      };

      response[jobId] = jobData;
    }

    await workerQueue.close();

    return responses.success(res, response);
  } catch (e) {
    next(e);
  }
};
