export interface UploadedFile {
  name: string;
  publicUrl: string;
}

export interface StorageService {
  uploadBlob: (data: Buffer | string) => Promise<UploadedFile>;
  uploadFile: (
    filename: string,
    data: Buffer | string
  ) => Promise<UploadedFile>;
}

export * from "./fleek";
export * from "./cloudinary";
