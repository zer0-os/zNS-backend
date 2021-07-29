import { Handler } from "@netlify/functions";
import { actions } from "../actions";
import { schemas } from "../schemas";
import { Maybe, UploadMetadataDto } from "../types";
import { responses, validateInput } from "../utilities";
import { requirePOSTRequest } from "../utilities/functions";


export const handler: Handler = async (event, context) => {
  try {
    try {
      requirePOSTRequest(event);
    } catch (e) {
      return responses.badRequest(e);
    }

    if (!event.body) {
      return responses.badRequest(`Message body is required`);
    }

    let input: Maybe<UploadMetadataDto>;
    try {
      input = validateInput(JSON.parse(event.body), schemas.uploadMetadataBodySchema)
    } catch (e) {
      return responses.badRequest(e);
    }

    const uploadedMetadata = await actions.uploadMetadataToIPFS(input);

    return responses.success(uploadedMetadata);
  }
  catch (e) {
    return responses.create(500, e);
  }

};
