import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  StreamableFile,
  ParseFilePipe,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { resolve } from 'path';
import { Express } from 'express';
import { ConfigService } from '@nestjs/config';
import { ProfilingInterceptor } from './interceptors/profiling.interceptor';

@Controller('file')
export class FileController {
  private readonly path: string;
  private readonly logger = new Logger('FileController');

  constructor(private readonly configService: ConfigService) {
    this.path = this.configService.get('UPLOADS_PATH', './uploads');
  }

  @Get(':id')
  @UseInterceptors(ProfilingInterceptor)
  getFile(@Param('id') id: string): StreamableFile {
    return new StreamableFile(createReadStream(resolve(this.path, id)));
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createFile(@UploadedFile(ParseFilePipe) file: Express.Multer.File): string {
    this.logger.log(`Saved file: ${file.filename} (${file.size} bytes)`);

    return file.filename;
  }
}
