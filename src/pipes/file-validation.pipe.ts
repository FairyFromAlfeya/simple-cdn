import {
  FileTypeValidator,
  HttpStatus,
  Injectable,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileValidationPipe extends ParseFilePipe {
  constructor(private readonly configService: ConfigService) {
    super({
      validators: [
        new MaxFileSizeValidator({
          maxSize: +configService.get('MAX_FILE_SIZE_BYTES', 2097152),
        }),
        new FileTypeValidator({
          fileType: new RegExp(
            configService.get('ALLOWED_FILE_EXTENSIONS', 'png'),
          ),
        }),
      ],
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    });
  }
}
