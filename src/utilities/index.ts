import Ajv, { JSONSchemaType } from "ajv";
import { Maybe } from "../types";

export * as responses from "./responses";

export function getEnvVariable(name: string, required?: boolean): Maybe<string> {
  const value = process.env[name];
  if (value === undefined && required) {
    throw Error(`Could not load env variable ${name}`);
  }

  return value;
}

const ajv = new Ajv();

export function validateInput<T>(input: object, schema: JSONSchemaType<T>): T {
  const validator = ajv.compile(schema);

  if (validator(input)) {
    return input as T;
  } else {
    throw Error(`Input is invalid: ${validator.errors}`);
  }
}