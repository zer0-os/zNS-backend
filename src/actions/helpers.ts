import {
  getCloudinaryStorageService,
  getFleekStorageService,
  StorageService,
} from "../storage";

import * as env from "env-var";

export const getFleekStorage = (): StorageService => {
  const service: StorageService = getFleekStorageService();
  return service;
};

export const getCloudinaryStorage = (): StorageService => {
  const service: StorageService = getCloudinaryStorageService(
    env.get("CLOUDINARY_FOLDER").asString()
  );
  return service;
};
