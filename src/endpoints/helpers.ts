import express from "express";
import getRawBody from "raw-body";
import { bytesToMb } from "../utilities";

export const getBodyAsBuffer = async (
  req: express.Request,
  res: express.Response,
  sizeLimit: string
): Promise<Buffer> => {
  try {
    const contents = await getRawBody(req, {
      length: req.headers["content-length"],
      limit: sizeLimit,
    });

    return contents;
  } catch (e) {
    if (e.type === "entity.too.large") {
      res.status(413);
      throw Error(`File too large, limit is ${bytesToMb(e.limit)}mb`);
    }
    throw e;
  }
};
