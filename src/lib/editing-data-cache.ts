// import Cache, { CacheInstance } from 'sync-disk-cache';
import { EditingData } from '@sitecore-jss/sitecore-jss-nextjs/editing';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { BlobServiceClient } = require('@azure/storage-blob');

// import { EditingData } from './editing-data';

/**
 * Defines an editing data cache implementation
 */
export interface EditingDataCache {
  set(key: string, editingData: EditingData): Promise<void>;
  get(key: string): Promise<EditingData | undefined>;
}

const AZURE_STORAGE_CONNECTION_STRING =
  'DefaultEndpointsProtocol=https;AccountName=storageaccountforjss;AccountKey=BsL7YkvCM/tKRa0CNGJPsTwa/SUlN3ytx+i5VXllspY/71sbspfuW4Z//tjdtUYMhdnFdD9hl0IW+AStfGvUiw==;EndpointSuffix=core.windows.net';
const containerName = 'cachekeys';

/**
 * A disk-based editing data cache implementation (required for hosting on Vercel via Serverless Functions)
 * @see EditingDataCache
 */
export class EditingDataDiskCache implements EditingDataCache {
  //   private cache: any;

  /**
   * @param {string} [tmpDir] Temp directory to use. Default is the OS temp directory (os.tmpdir()).
   */
  //   constructor(tmpDir: string = os.tmpdir()) {
  //     // Use gzip compression and store using the OS temp directory (Vercel Serverless Functions have temp directory access)
  //     // this.cache = new Cache('editing-data', { compression: 'gzip', location: tmpDir });
  //   }

  async set(key: string, editingData: EditingData): Promise<void> {
    // const filePath = this.cache.set(key, JSON.stringify(editingData));
    // if (!filePath || filePath.length === 0) {
    //   throw new Error(`Editing data cache not set for key ${key} at ${this.cache.root}`);
    // }

    // Create a unique name for the blob
    const blobName = key + '.txt';
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Display blob name and url
    console.log(
      `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`
    );

    // Upload data to the blob
    const data = JSON.stringify(editingData);
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
    console.log(`Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`);
  }

  async get(key: string): Promise<EditingData | undefined> {
    // Convert stream to text
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function streamToText(readable: any) {
      readable.setEncoding('utf8');
      let data = '';
      for await (const chunk of readable) {
        data += chunk;
      }
      return data;
    }
    // const entry = this.cache.get(key);
    // if (!entry.isCached) {
    //   console.warn(`Editing data cache miss for key ${key} at ${this.cache.root}`);
    //   return undefined;
    // }
    // // Remove to preserve disk-space (as a macrotask so as not to block current execution)
    // setTimeout(() => this.cache.remove(key));
    // return JSON.parse(entry.value) as EditingData;
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(key + '.txt');

    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    console.log('\nDownloaded blob content...');
    const blobData = await streamToText(downloadBlockBlobResponse.readableStreamBody);
    console.log('blobData', blobData);
    return JSON.parse(blobData);
  }
}

/** EditingDataDiskCache singleton */
export const editingDataDiskCache = new EditingDataDiskCache();
