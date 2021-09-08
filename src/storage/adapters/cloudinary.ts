import * as cloudinary from "cloudinary";
import * as streamifier from "streamifier";

export const uploadFile = async (
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

  const response = await finishedUploading;

  return response;
};
