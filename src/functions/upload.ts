import { Handler } from "@netlify/functions";
import { actions } from "../actions";
import { FleekUploadedFile } from "../storage";
import { convertToResponse, responses } from "../utilities";
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

    const uploadedFile = await actions.uploadDataToIPFS(event.body);
    const response = convertToResponse(uploadedFile as FleekUploadedFile);

    return responses.success(response);
  }
  catch (e) {
    return responses.create(500, e);
  }

};
