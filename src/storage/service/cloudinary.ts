import hasha from "hasha";
import { StorageService, UploadedFile } from ".";
import { Maybe } from "../../types";
import * as cloudinary from "../adapters/cloudinary";

export const getCloudinaryStorageService = (
  folder?: string
): StorageService => {
  const uploadFile = async (filename: string, data: Buffer | string) => {
    let dataAsBuffer: Maybe<Buffer>;

    if (typeof data === "string") {
      dataAsBuffer = Buffer.from(data);
    } else {
      dataAsBuffer = data;
    }

    const res = await cloudinary.uploadFile(filename, dataAsBuffer, folder);
    const file: UploadedFile = {
      name: filename,
      publicUrl: res.url,
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
