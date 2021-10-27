import { getCloudinaryUploadQueue } from "../queue";
import { FleekUploadedFile, UploadedFile } from "../storage";
import { CloudinaryUploadMessageDto } from "../types";
import { uploadDataToIPFS } from "./uploadDataToIPFS";

export async function uploadAndQueueCloudinary(
  data: Buffer | string
): Promise<UploadedFile> {
  const ipfsFile = (await uploadDataToIPFS(data)) as FleekUploadedFile;

  const workQueue = getCloudinaryUploadQueue();
  const message: CloudinaryUploadMessageDto = {
    url: ipfsFile.publicUrl,
    hash: ipfsFile.ipfsHash,
  };
  await workQueue.add(message);

  return ipfsFile;
}
