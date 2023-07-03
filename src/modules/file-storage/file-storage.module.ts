import {Module} from '@nestjs/common';
import {AuthModule} from '../auth/auth.module';
import {AdminModule} from '../admin1/admin.module';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {S3Handler} from 'src/shared/S3Handler';
import {FileStorageController} from './file-storage.controller';
import {FileStorageService} from './file-storage.service';
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // signOptions: {
      //   algorithm: 'RS256'
      // }
    }),
    AuthModule,
    AdminModule,
  ],
  providers: [S3Handler, FileStorageService],
  controllers: [FileStorageController],
})
export class FileStorageModule {}
