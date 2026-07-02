import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';
import { IFileStorageProvider } from '../ports/file-storage.port';
import * as crypto from 'crypto';

@Injectable()
export class MinioStorageAdapter implements IFileStorageProvider, OnModuleInit {
  private readonly minioClient: Minio.Client;
  private readonly bucketName: string;
  private readonly logger = new Logger(MinioStorageAdapter.name);

  constructor() {
    this.bucketName = process.env.MINIO_BUCKET || 'phase-one-bucket';
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000', 10),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });
  }

  async onModuleInit() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'ap-southeast-1');
        this.logger.log(`Bucket '${this.bucketName}' created successfully.`);
      }
    } catch (error) {
      this.logger.error(`Unable to verify or connect to MinIO bucket: ${error.message}`);
    }
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    const ext = fileName.split('.').pop();
    const uniqueFileName = `${crypto.randomUUID()}.${ext}`;
    
    await this.minioClient.putObject(
      this.bucketName,
      uniqueFileName,
      fileBuffer,
      fileBuffer.length,
      { 'Content-Type': mimeType }
    );
    
    return uniqueFileName;
  }

  async getFileUrl(objectName: string): Promise<string> {
    // สร้าง Signed URL ที่มีอายุการใช้งาน 1 ชั่วโมง (3600 วินาที)
    return await this.minioClient.presignedGetObject(this.bucketName, objectName, 3600);
  }

  async deleteFile(objectName: string): Promise<void> {
    await this.minioClient.removeObject(this.bucketName, objectName);
  }
}
