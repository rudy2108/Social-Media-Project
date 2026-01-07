import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for frontend (before any routes)
  app.enableCors({
    origin: 'http://localhost:3001', // Frontend URL
    credentials: true,
  });

  // Serve static files from uploads directory BEFORE global prefix
  // This ensures /uploads is accessible at the root level
  // Note: __dirname in compiled code is dist/src, so we need ../../uploads to reach root
  app.use('/uploads', express.static(join(__dirname, '..', '..', 'uploads')));

  // Add global prefix AFTER static file serving
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
