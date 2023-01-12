import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { extname } from 'path';
import { FileController } from './file.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get('UPLOADS_PATH', './uploads'),
          filename: (_, file, callback) => {
            callback(null, `${v4()}${extname(file.originalname)}`);
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [FileController],
})
export class AppModule {}
