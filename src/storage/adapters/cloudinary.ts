import * as cloudinary from "cloudinary";
import * as streamifier from "streamifier";
import { Maybe } from "../../types";

const uploadStreamToCloudinary = async (
  type: string = "image",
  publicId: string,
  data: Buffer,
  folder?: string
) => {
  const finishedUploading = new Promise<cloudinary.UploadApiResponse>(
    (resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          public_id: publicId,
          folder,
          resource_type: type,
        },
        (err, res) => {
          if (err) {
            reject(err);
            return;
          }

          if (!res) {
            reject(new Error("no response"));
            return;
          }

          resolve(res);
        }
      );

      streamifier.createReadStream(data).pipe(uploadStream);
    }
  );

  return finishedUploading;
};

export const uploadFile = async (
  publicId: string,
  data: Buffer,
  folder?: string
): Promise<cloudinary.UploadApiResponse> => {
  let response: Maybe<cloudinary.UploadApiResponse>;

  console.log(`Attempting to upload as video...`);
  try {
    response = await uploadStreamToCloudinary("video", publicId, data, folder);
    return response;
  } catch (e) {
    console.debug(`Failed to upload as video.`);
    console.debug(e);
  }

  console.log(`Attempting to upload as image...`);
  try {
    response = await uploadStreamToCloudinary("image", publicId, data, folder);
    return response;
  } catch (e) {
    console.debug(`Failed to upload as image.`);
    console.debug(e);
  }

  throw Error(`Unable to upload data to cloudinary as image or video.`);
};
