import { Module, Global } from '@nestjs/common';
import { FILE_STORAGE_PROVIDER } from './ports/file-storage.port';
import { MinioStorageAdapter } from './adapters/minio-storage.adapter';

@Global()
@Module({
  providers: [
    {
      provide: FILE_STORAGE_PROVIDER,
      useClass: MinioStorageAdapter,
    },
  ],
  exports: [FILE_STORAGE_PROVIDER],
})
export class StorageModule {}
