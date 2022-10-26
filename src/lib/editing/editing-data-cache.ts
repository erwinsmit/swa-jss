import { EditingData } from './editing-data';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { streamToString } from './streamToText';
import { debug } from '@sitecore-jss/sitecore-jss';

/**
 * Defines an editing data cache implementation
 */
export interface EditingDataCache {
  set(key: string, editingData: EditingData): Promise<void>;
  get(key: string): Promise<EditingData | undefined>;
}

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING as string;
const containerName = process.env.AZURE_BLOB_CONTAINER as string;

/**
 * A disk-based editing data cache implementation (required for hosting on Vercel via Serverless Functions)
 * @see EditingDataCache
 */
export class EditingDataBlobCache implements EditingDataCache {
  private containerClient: ContainerClient;

  constructor() {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );

    this.containerClient = blobServiceClient.getContainerClient(containerName);
  }

  async set(key: string, editingData: EditingData): Promise<void> {
    const blobName = key + '.txt';

    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

    // Display blob name and url
    debug.editing(
      `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`
    );

    // Upload data to the blob
    const data = JSON.stringify(editingData);
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length);

    debug.editing(`Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`);
  }

  async get(key: string): Promise<EditingData | undefined> {
    // Get a block blob client
    const blockBlobClient = this.containerClient.getBlockBlobClient(key + '.txt');
    const downloadBlockBlobResponse = await blockBlobClient.download(0);

    debug.editing('\nDownloaded blob content...');

    if (downloadBlockBlobResponse.readableStreamBody) {
      const blobData = await streamToString(downloadBlockBlobResponse.readableStreamBody);
      blockBlobClient.deleteIfExists();

      return JSON.parse(blobData);
    } else {
      return undefined;
    }
  }
}

/** EditingDataBlobCache singleton */
export const editingDataCache = new EditingDataBlobCache();
