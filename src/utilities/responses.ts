export const create = (code: number, body: object) => {
  return {
    statusCode: code,
    body: JSON.stringify(body),
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  }
}

export const success = (body: object | string) => {
  if (typeof (body) === "string") {
    return messageResponse(200, body);
  }

  return create(200, body);
}

export const messageResponse = (code: number, message: string) => {
  return create(code, { message });
}

export const badRequest = (message: string) => {
  return messageResponse(400, message);
}