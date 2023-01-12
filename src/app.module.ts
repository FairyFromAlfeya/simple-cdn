import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileController } from './file.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [FileController],
})
export class AppModule {}
