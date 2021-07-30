import hasha from "hasha";
import * as fleek from "./fleek";

export interface UploadedFile {
  name: string;
  publicUrl: string;
  ipfsHash: string;
}

export interface StorageService {
  uploadBlob: (data: Buffer | string) => Promise<UploadedFile>;
  uploadFile: (
    filename: string,
    data: Buffer | string
  ) => Promise<UploadedFile>;
}

const defaultBucket = process.env.FLEEK_BUCKET;

export interface FleekUploadedFile extends UploadedFile {
  fleekHash: string;
}

export const getFleekStorageService = (bucket?: string): StorageService => {
  bucket = bucket ?? defaultBucket;

  const uploadFile = async (filename: string, data: Buffer | string) => {
    const res = await fleek.uploadFile(filename, data, bucket);
    const file: FleekUploadedFile = {
      name: filename,
      publicUrl: res.publicUrl,
      ipfsHash: res.hashV0,
      fleekHash: res.hash,
    };

    return file;
  };

  const uploadBlob = async (data: Buffer | string) => {
    const hash = hasha(data, {
      algorithm: "sha256",
    });
    const file = uploadFile(hash, data);
    return file;
  };

  const storageService = {
    uploadFile,
    uploadBlob,
  };

  return storageService;
};
