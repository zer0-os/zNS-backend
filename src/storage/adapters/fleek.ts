import * as env from "env-var";
import fleekStorage, { uploadInput } from "@zero-tech/fleek-storage-js";

const fleekAuth = () => {
  return {
    apiKey: env.get(`FLEEK_STORAGE_API_KEY`).required().asString(),
    apiSecret: env.get(`FLEEK_STORAGE_API_SECRET`).required().asString(),
  };
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const maxAttempts = 3;
const delayAmount = 500;

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

  let numAttempts = 0;
  let lastError: Error | undefined;
  while (numAttempts < maxAttempts) {
    try {
      const file = await fleekStorage.upload(uploadRequest);
      return file;
    } catch (e) {
      lastError = e;
      numAttempts++;
      if (numAttempts < maxAttempts) {
        delay(delayAmount);
      }
    }
  }

  throw lastError;
};

export const getFileFromHash = async (hash: string): Promise<Buffer> => {
  const file = await fleekStorage.getFileFromHash({
    hash,
    getFileFromHashOptions: ["buffer"],
  });

  return file as Buffer;
};
