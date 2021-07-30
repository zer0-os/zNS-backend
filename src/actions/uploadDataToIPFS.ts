import { getStorage } from "./helpers";

export async function uploadDataToIPFS(data: Buffer | string) {
  const storage = getStorage();
  const uploadedFile = await storage.uploadBlob(data);

  return uploadedFile;
}
