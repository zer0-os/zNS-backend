import { UploadedFile } from "../storage";
import { getStorage } from "./helpers";

export async function uploadDataToIPFS(
  data: Buffer | string
): Promise<UploadedFile> {
  const storage = getStorage();
  const uploadedFile = await storage.uploadBlob(data);

  return uploadedFile;
}
