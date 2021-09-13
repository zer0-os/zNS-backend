import { FleekUploadedFile, UploadedFile } from "../storage";
import { getCloudinaryStorage } from "./helpers";
import { uploadDataToIPFS } from "./uploadDataToIPFS";

export async function uploadContentToIPFSAndCloudinary(
  data: Buffer | string
): Promise<UploadedFile> {
  const ipfsFile = (await uploadDataToIPFS(data)) as FleekUploadedFile;

  const cloudinaryStorage = getCloudinaryStorage();

  const uploadToCloudinary = async () => {
    console.log(`Uploading ${ipfsFile.ipfsHash}...`);
    try {
      await cloudinaryStorage.uploadFile(ipfsFile.ipfsHash, data);
    } catch (e) {
      console.error(`Failed to upload file ${ipfsFile.ipfsHash}`);
      console.error(e);
      return;
    }

    console.log(`Successfully uploaded ${ipfsFile.ipfsHash} to Cloudinary`);
  };

  /**
   * This call is purposely not awaited so that the API endpoint returns an HTTP response
   * immediately but the worker thread continues on to upload the file to Cloudinary.
   * This is done because Heroku API's must respond within 30 seconds, and it's likely that
   * a timeout will occur when uploading the file twice for very large files.
   */
  setTimeout(() => uploadToCloudinary(), 0);

  return ipfsFile;
}
