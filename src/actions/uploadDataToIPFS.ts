import { UploadedFile } from "../storage";
import { getFleekStorage } from "./helpers";

export async function uploadDataToIPFS(
  data: Buffer | string
): Promise<UploadedFile> {
  const storage = getFleekStorage();
  const uploadedFile = await storage.uploadBlob(data);

  return uploadedFile;
}
