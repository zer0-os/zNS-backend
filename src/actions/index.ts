import { getFleekStorageService, StorageService } from "../storage";
import { Metadata } from "../types";

const getStorage = (): StorageService => {
  const service: StorageService = getFleekStorageService();
  return service;
}

async function uploadMetadataToIPFS(metadata: Metadata) {
  const storage = getStorage();
  const metadataJson = JSON.stringify(metadata);

  try {
    const uploadedMetadata = await storage.uploadBlob(metadataJson);

    return uploadedMetadata;
  }
  catch (e) {
    throw Error(`Failed to upload to storage: ${e}`);
  }
}

export const actions = {
  uploadMetadataToIPFS
}