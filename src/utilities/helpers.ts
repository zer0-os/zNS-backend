import Ajv, { JSONSchemaType } from "ajv";
import { FleekUploadedFile } from "../storage";
import { UploadedFileResponse } from "../types";
import * as env from "env-var";

const ajv = new Ajv();

export function validateInput<T>(
  input: Record<string, unknown>,
  schema: JSONSchemaType<T>
): T {
  const validator = ajv.compile(schema);

  if (validator(input)) {
    return input as T;
  } else {
    throw Error(`Input is invalid: ${validator.errors}`);
  }
}

const ipfsGateway = `https://ipfs.fleek.co/ipfs/`;

export function convertToResponse(
  input: FleekUploadedFile
): UploadedFileResponse {
  const response: UploadedFileResponse = {
    hash: input.ipfsHash,
    fleekHash: input.fleekHash,
    url: `${ipfsGateway}${input.ipfsHash}`,
  };

  return response;
}

export function isProduction() {
  const environment: string = env.get("ENVIRONMENT").default("prod").asString();
  const isProd = environment === "prod";
  return isProd;
}

