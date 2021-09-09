import hasha from "hasha";
import { StorageService, UploadedFile } from "..";
import * as fleek from "../adapters/fleek";

const defaultBucket = process.env.FLEEK_BUCKET;
const fleekPrefix = process.env.FLEEK_PREFIX;

export interface FleekUploadedFile extends UploadedFile {
  fleekHash: string;
  ipfsHash: string;
}

export const getFleekStorageService = (bucket?: string): StorageService => {
  bucket = bucket ?? defaultBucket;
  const prefix = fleekPrefix ?? "";

  const uploadFile = async (filename: string, data: Buffer | string) => {
    const res = await fleek.uploadFile(`${prefix}${filename}`, data, bucket);
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
