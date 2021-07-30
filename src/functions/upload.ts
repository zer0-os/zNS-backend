import { Handler } from "@netlify/functions";
import { actions } from "../actions";
import { FleekUploadedFile } from "../storage";
import { convertToResponse, responses } from "../utilities";
import { requirePOSTRequest } from "../utilities/functions";

export const handler: Handler = async (event) => {
  try {
    try {
      requirePOSTRequest(event);
    } catch (e) {
      return responses.badRequest(e);
    }

    if (!event.body) {
      return responses.badRequest(`Message body is required`);
    }

    const contents = event.isBase64Encoded
      ? Buffer.from(event.body, "base64")
      : Buffer.from(event.body);

    const uploadedFile = await actions.uploadDataToIPFS(contents);
    const response = convertToResponse(uploadedFile as FleekUploadedFile);

    return responses.success(response);
  } catch (e) {
    return responses.create(500, e);
  }
};
