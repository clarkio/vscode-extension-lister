import { promises } from 'fs'; // leverage the Node.js file system module's writeFile function

export function writeExtensionListFile(uri: string, data: any) {
  return promises.writeFile(uri, data);
}
