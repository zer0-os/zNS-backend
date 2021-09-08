import { FleekUploadedFile, UploadedFile } from "../storage";
import { getCloudinaryStorage, getFleekStorage } from "./helpers";

export async function uploadContentToIPFSAndCloudinary(
  data: Buffer | string
): Promise<UploadedFile> {
  const fleekStorage = getFleekStorage();
  const ipfsFile = (await fleekStorage.uploadBlob(data)) as FleekUploadedFile;

  const cloudinaryStorage = getCloudinaryStorage();

  const uploadToCloudinary = async () => {
    try {
      await cloudinaryStorage.uploadFile(ipfsFile.ipfsHash, data);
    } catch (e) {
      console.error(`Failed to upload file ${ipfsFile.ipfsHash}`);
      console.error(e);
      return;
    }

    console.log(`Successfully uploading ${ipfsFile.ipfsHash} to Cloudinary`);
  };

  // Purposely don't await
  uploadToCloudinary();

  return ipfsFile;
}
