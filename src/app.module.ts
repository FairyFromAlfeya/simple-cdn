import {
  HttpStatus,
  Module,
  ParseFilePipe,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { extname } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get<string>('UPLOADS_PATH') || './',
          filename: (req, file, callback) => {
            callback(null, `${v4()}${extname(file.originalname)}`);
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: ParseFilePipe,
      useFactory: async (configService: ConfigService) => {
        const fileType = new RegExp(
          configService.get('ALLOWED_FILE_EXTENSIONS', 'png'),
        );
        const maxSize = +configService.get('MAX_FILE_SIZE_BYTES', 2097152);

        return new ParseFilePipeBuilder()
          .addFileTypeValidator({ fileType })
          .addMaxSizeValidator({ maxSize })
          .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY });
      },
      inject: [ConfigService],
    },
  ],
  controllers: [FileController],
})
export class AppModule {}
