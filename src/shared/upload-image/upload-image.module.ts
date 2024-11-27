import { Global, Module } from '@nestjs/common';
import { UploadImageService } from './upload-image.service';

@Global()
@Module({
  providers: [UploadImageService],
  exports: [UploadImageService],
})
export class UploadImageModule {}
