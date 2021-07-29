import { getEnvVariable } from "../utilities"

import fleekStorage, { uploadInput } from '@fleekhq/fleek-storage-js'

const fleekAuth = () => {
  return {
    apiKey: getEnvVariable(`FLEEK_STORAGE_API_KEY`, true)!,
    apiSecret: getEnvVariable(`FLEEK_STORAGE_API_SECRET`, true)!
  }
}

export const getFile = (filename: string, bucket?: string) => {

}

export const uploadFile = async (filename: string, data: Buffer | string, bucket?: string) => {
  const uploadRequest: uploadInput = {
    ...fleekAuth(),
    key: filename,
    bucket,
    data,
  }

  const file = await fleekStorage.upload(uploadRequest);

  return file;
}
