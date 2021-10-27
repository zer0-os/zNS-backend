import axios from "axios";
import FormData from "form-data";

export interface PinResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export const pinFileToIPFSv2 = async (file: any) => {
  const url = "https://managed.mypinata.cloud/api/v1/content";
};

export const pinFileToIPFS = async (
  pinataApiKey: string,
  pinataSecretApiKey: string,
  file: any,
  contentType: string
) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  //we gather a local file for this example, but any valid readStream source will work here.
  let data = new FormData();

  data.append("file", file, {
    contentType,
    filename: "useless",
  });

  //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
  //metadata is optional
  // const metadata = JSON.stringify({
  //   name: "testname",
  //   keyvalues: {
  //     exampleKey: "exampleValue",
  //   },
  // });
  // data.append("pinataMetadata", metadata);

  //pinataOptions are optional
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    customPinPolicy: {
      regions: [
        {
          id: "FRA1",
          desiredReplicationCount: 1,
        },
        {
          id: "NYC1",
          desiredReplicationCount: 2,
        },
      ],
    },
  });
  data.append("pinataOptions", pinataOptions);

  const res = await axios.post(url, data, {
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": `multipart/form-data; boundary=${data.getBoundary()}`,
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretApiKey,
    },
  });

  return res.data as PinResponse;
};

export const pinJSONToIPFS = async (
  pinataApiKey: string,
  pinataSecretApiKey: string,
  JSONBody: string
) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  const res = await axios.post(url, JSONBody, {
    headers: {
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretApiKey,
    },
  });

  const body = res.data as PinResponse;

  return body;
};
