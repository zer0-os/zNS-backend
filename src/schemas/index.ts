import { JSONSchemaType } from "ajv";
import { Metadata, UploadMetadataDto } from "../types";

const metadataSchema: JSONSchemaType<Metadata> = {
  type: "object",
  properties: {
    title: { type: "string" },
    story: { type: "string" },
    image: { type: "string" }
  },
  required: ['story', 'image', 'title'],
  additionalProperties: false
}

const uploadMetadataBodySchema: JSONSchemaType<UploadMetadataDto> = {
  type: "object",
  properties: {
    metadata: metadataSchema
  },
  required: ['metadata'],
  additionalProperties: false
}

export const schemas = {
  uploadMetadataBodySchema
}