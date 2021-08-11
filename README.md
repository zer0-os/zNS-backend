# zNS Backend

This repo contains the zNS backend code built to support the zNS dApp.

It is used for web api methods to be run by the dApp.

## Web API Methods

These methods are offered by the backend.

### Upload File to IPFS

Accessed via a POST request to the method `upload`

The body is the binary contents of a file to upload.

The return will be a JSON object:

```
{
  hash: <IPFS hash of the file>,
  fleekHash: <The fleek hash of the file>,
  url: <URL to access the file>
}
```
