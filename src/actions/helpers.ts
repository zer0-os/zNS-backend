import { getFleekStorageService, StorageService } from "../storage";

export const getStorage = (): StorageService => {
  const service: StorageService = getFleekStorageService();
  return service;
}
