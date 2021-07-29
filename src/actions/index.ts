import { getFleekStorageService, StorageService } from "../storage";
import { getFileFromHash } from "../storage/fleek";
import { Metadata, UploadMetadataDto } from "../types";

const getStorage = (): StorageService => {
  const service: StorageService = getFleekStorageService();
  return service;
}

async function uploadMetadataToIPFS(params: UploadMetadataDto) {
  const storage = getStorage();

  // Download the image and upload to Fleek Storage
  const imageFile = await getFileFromHash(params.imageHash);
  const uploadedImage = await storage.uploadBlob(imageFile);

  const metadata: Metadata = {
    title: params.title,
    story: params.story,
    image: `https://ipfs.fleek.co/ipfs/${uploadedImage.ipfsHash}`
  }

  const metadataJson = JSON.stringify(metadata);

  const uploadedMetadata = await storage.uploadBlob(metadataJson);
  return uploadedMetadata;
}

export const actions = {
  uploadMetadataToIPFS
}