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
): Promise<void> => {
  try {
    const delayed = new DelayedResponse(req, res, next);

    const upload = async (callback: any) => {
      let contents: Maybe<Buffer | string>;

      if (req.readable) {
        contents = await getBodyAsBuffer(req, res, "100mb");
      } else {
        contents = JSON.stringify(req.body);
      }

      if (contents.length === 0) {
        callback("no body");
        return;
      }

      const uploadedFile = await actions.uploadAndQueueCloudinary(contents);
      const response = convertToResponse(uploadedFile as FleekUploadedFile);

      callback(undefined, response);
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
