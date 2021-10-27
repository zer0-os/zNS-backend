import { FleekUploadedFile } from "./storage";

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

export enum Environment {
  dev,
  prod,
}

export interface CloudinaryUploadMessageDto {
  url: string;
  hash: string;
}

export interface BackgroundUploadMessageDto {
  url: string; // public URL
}
