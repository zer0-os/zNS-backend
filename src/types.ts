export type Maybe<T> = T | undefined | null;

export interface Metadata {
  title: string;
  story: string;
  image: string;
}

export interface UploadMetadataDto {
  title: string;
  story: string;
  imageHash: string;
}

export interface UploadedFileResponse {
  hash: string;
  url: string;
  fleekHash: string;
}