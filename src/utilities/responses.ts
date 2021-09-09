import express from "express";

type Response = express.Response;

export const create = (
  res: express.Response,
  code: number,
  // eslint-disable-next-line @typescript-eslint/ban-types
  body: object
): Response => {
  const response = res.status(code).send(body);
  return response;
};

export const success = (
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/ban-types
  body: object | string
): Response => {
  if (typeof body === "string") {
    return messageResponse(res, 200, body);
  }

  return create(res, 200, body);
};

export const messageResponse = (
  res: express.Response,
  code: number,
  message: string
): Response => {
  return create(res, code, { message });
};

export const badRequest = (
  res: express.Response,
  message: string
): Response => {
  return messageResponse(res, 400, message);
};
