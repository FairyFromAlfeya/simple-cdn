import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  StreamableFile,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream, writeFileSync } from 'fs';
import { extname, resolve } from 'path';
import { Express } from 'express';
import { v4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { ProfilingInterceptor } from './interceptors/profiling.interceptor';
import { FileValidationPipe } from './pipes/file-validation.pipe';

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
  createFile(
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
  ): string {
    writeFileSync(
      resolve(this.path, v4(), extname(file.originalname)),
      file.buffer,
    );

    this.logger.log(`Saved file: ${file.filename} (${file.size} bytes)`);

    return file.filename;
  }
}
