export type Maybe<T> = T | undefined | null;

export interface Metadata {
  title: string;
  story: string;
  image: string;
}

export interface UploadMetadataDto {
  metadata: Metadata;
}