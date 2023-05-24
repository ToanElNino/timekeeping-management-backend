import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {ApiConsumes, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {FileStorageBaseResponse} from './response/FileStorageBaseResponse.dto';
import {FileStorageRequest} from './request/FileStorageRequest.dto';
import {FileInterceptor} from '@nestjs/platform-express';
import {FileStorageService} from './file-storage.service';
@Controller('file-storage')
export class FileStorageController {
  constructor(private fileStorageService: FileStorageService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    tags: ['file-storage'],
    operationId: 'Upload file',
    summary: 'Upload file',
    description: 'Upload file',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: FileStorageBaseResponse,
  })
  @ApiConsumes('multipart/form-data')
  async createAChain(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: FileStorageRequest
  ): Promise<FileStorageBaseResponse | any> {
    return this.fileStorageService.uploadFile(file);
  }
}
