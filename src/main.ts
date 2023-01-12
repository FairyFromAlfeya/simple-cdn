import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

NestFactory.create(AppModule).then((app) => {
  const origin = (process.env.ALLOWED_ORIGINS || '').split(',');
  const port = process.env.PORT || 3000;

  app.enableCors({ origin });

  return app.listen(port);
});
