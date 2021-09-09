import express from "express";
import { actions } from "../actions";
import { FleekUploadedFile } from "../storage";
import { Maybe } from "../types";
import { convertToResponse, responses } from "../utilities";
import { getBodyAsBuffer } from "./helpers";

export const upload = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<undefined | express.Response> => {
  try {
    let contents: Maybe<Buffer | string>;

    if (req.readable) {
      contents = await getBodyAsBuffer(req, res, "50mb");
    } else {
      contents = JSON.stringify(req.body);
    }

    if (contents.length === 0) {
      return responses.badRequest(res, `Empty body`);
    }

    const uploadedFile = await actions.uploadDataToIPFS(contents);
    const response = convertToResponse(uploadedFile as FleekUploadedFile);

    return responses.success(res, response);
  } catch (e) {
    next(e);
  }
};
