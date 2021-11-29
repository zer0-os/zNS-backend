import Bull from "bull";
import express from "express";
import { getBackgroundUploadQueue } from "../queue";
import { BackgroundUploadMessageDto, Maybe } from "../types";
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

    let lowestJobNumber = 0;
    let highestJobNumber = 0;

    dto.jobIds.forEach((jobId: number) => {
      if (lowestJobNumber === 0 || lowestJobNumber > jobId) {
        lowestJobNumber = jobId;
      }
      if (highestJobNumber < jobId) {
        highestJobNumber = jobId;
      }
    });

    const jobs = await workerQueue.getJobs(
      ["completed", "waiting", "active", "delayed", "failed", "paused"],
      lowestJobNumber - 1,
      highestJobNumber + 1
    );

    for (const jobId of dto.jobIds) {
      const index = jobs.findIndex((job) => {
        return job.id === jobId;
      });
      if (index === -1) {
        console.error(`Could not find job with id of ${jobId}`);
        continue;
      }
      const job = jobs[index];

      if (!job) {
        continue;
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
