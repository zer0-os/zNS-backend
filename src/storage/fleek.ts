import * as env from "env-var";
import fleekStorage, { uploadInput } from "@fleekhq/fleek-storage-js";

const fleekAuth = () => {
  return {
    apiKey: env.get(`FLEEK_STORAGE_API_KEY`).required().asString(),
    apiSecret: env.get(`FLEEK_STORAGE_API_SECRET`).required().asString()
  };
};

export const uploadFile = async (
  filename: string,
  data: Buffer | string,
  bucket?: string
): Promise<fleekStorage.uploadOutput> => {
  const uploadRequest: uploadInput = {
    ...fleekAuth(),
    key: filename,
    bucket,
    data,
  };

  const file = await fleekStorage.upload(uploadRequest);

  return file;
};

export const getFileFromHash = async (hash: string): Promise<Buffer> => {
  const file = await fleekStorage.getFileFromHash({
    hash,
    getFileFromHashOptions: ["buffer"],
  });

  return file as Buffer;
};
