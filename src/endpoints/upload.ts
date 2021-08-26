import express from "express";
import getRawBody from "raw-body";
import { actions } from "../actions";
import { FleekUploadedFile } from "../storage";
import { Maybe } from "../types";
import { convertToResponse, responses } from "../utilities";

export const upload = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    let contents: Maybe<Buffer | string>;

    if (req.readable) {
      try {
        contents = await getRawBody(req, {
          length: req.headers["content-length"],
          limit: "50mb",
        });
      } catch (e) {
        if (e.type === "entity.too.large") {
          res.status(413);
          throw Error(
            `File too large, limit is ${(e.limit / 1024 / 1024).toPrecision(
              2
            )}mb`
          );
        }
        throw e;
      }
    } else {
      contents = JSON.stringify(req.body);
    }

    const uploadedFile = await actions.uploadDataToIPFS(contents);
    const response = convertToResponse(uploadedFile as FleekUploadedFile);

    return responses.success(res, response);
  } catch (e) {
    next(e);
  }
};
