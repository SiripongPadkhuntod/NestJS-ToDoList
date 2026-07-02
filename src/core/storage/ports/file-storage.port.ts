export const FILE_STORAGE_PROVIDER = 'FILE_STORAGE_PROVIDER';

export interface IFileStorageProvider {
  /**
   * Upload a file and return the generated object name/path
   */
  uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string>;

  /**
   * Get a signed URL to download or view the file
   */
  getFileUrl(objectName: string): Promise<string>;

  /**
   * Delete a file
   */
  deleteFile(objectName: string): Promise<void>;
}
