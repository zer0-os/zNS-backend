import { JSONSchemaType } from "ajv";
import { UploadMetadataDto } from "../types";

const uploadMetadataBodySchema: JSONSchemaType<UploadMetadataDto> = {
  type: "object",
  properties: {
    title: { type: "string" },
    story: { type: "string" },
    imageHash: { type: "string" }
  },
  required: ['title', 'story', 'imageHash'],
  additionalProperties: false
}

export const schemas = {
  uploadMetadataBodySchema
}