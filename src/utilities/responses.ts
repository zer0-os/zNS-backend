interface Response {
  statusCode: number;
  body: string;
  headers: Record<string, string>;
}

export const create = (
  code: number,
  body: object
): Response => {
  return {
    statusCode: code,
    body: JSON.stringify(body),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};

export const success = (body: object | string): Response => {
  if (typeof body === "string") {
    return messageResponse(200, body);
  }

  return create(200, body);
};

export const messageResponse = (code: number, message: string): Response => {
  return create(code, { message });
};

export const badRequest = (message: string): Response => {
  return messageResponse(400, message);
};
