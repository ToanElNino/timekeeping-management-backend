import {Injectable} from '@nestjs/common';
import {S3Handler} from 'src/shared/S3Handler';

@Injectable()
export class FileStorageService {
  constructor(private readonly s3Handler: S3Handler) {}
  async uploadFile(file: Express.Multer.File) {
    let url = null;
    if (file) {
      const s3Response = await this.s3Handler.upload('velo-orbit', file);
      if (s3Response.Location) url = s3Response.Location;
    }
    return {url};
  }
}
