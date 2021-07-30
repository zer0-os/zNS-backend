import Ajv, { JSONSchemaType } from "ajv";
import { FleekUploadedFile } from "../storage";
import { Maybe, UploadedFileResponse } from "../types";

export * as responses from "./responses";

export function getEnvVariable(
  name: string,
  required?: boolean
): Maybe<string> {
  const value = process.env[name];
  if (value === undefined && required) {
    throw Error(`Could not load env variable ${name}`);
  }

  return value;
}

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
