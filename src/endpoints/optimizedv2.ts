import express from "express";
import { actions } from "../actions";
import { FleekUploadedFile } from "../storage";
import { Maybe } from "../types";
import { convertToResponse, responses } from "../utilities";
import { getBodyAsBuffer } from "./helpers";
const DelayedResponse = require("http-delayed-response");

export const optimizedv2 = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<undefined> => {
  try {
    const delayed = new DelayedResponse(req, res);

    const upload = async () => {
      let contents: Maybe<Buffer | string>;

      if (req.readable) {
        contents = await getBodyAsBuffer(req, res, "100mb");
      } else {
        contents = JSON.stringify(req.body);
      }

      if (contents.length === 0) {
        responses.badRequest(res, `Empty body`);
        res.end();
        return;
      }

      const uploadedFile = await actions.uploadAndQueueCloudinary(contents);
      const response = convertToResponse(uploadedFile as FleekUploadedFile);

      responses.success(res, response);
      res.end();
      return;
    };

    delayed.json();

    delayed.start(1000, 10000);
    const finished = upload();
    delayed.end(finished);

    return;
  } catch (e) {
    next(e);
  }
};
