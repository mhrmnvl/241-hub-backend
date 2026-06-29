import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { AppModule } from '../src/app.module.js';

let app: NestExpressApplication;

async function createApp() {
  if (app) return app;

  app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const { ConfigService } = await import('@nestjs/config');
  const { Logger } = await import('nestjs-pino');
  const { DocumentBuilder, SwaggerModule } = await import('@nestjs/swagger');

  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);
  const trustProxy = configService.get<number>('TRUST_PROXY', 1);
  const frontendUrl = configService.get<string>(
    'FRONTEND_URL',
    'http://localhost:5173',
  );
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  app.set('trust proxy', trustProxy);

  app.use((req: Request, _res: Response, next: NextFunction) => {
    req._startTime = Date.now();
    next();
  });

  app.use(cookieParser());

  app.use(
    helmet({
      contentSecurityPolicy: isProduction
        ? undefined
        : {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
              styleSrc: ["'self'", "'unsafe-inline'"],
            },
          },
    }),
  );

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const { ValidationPipe: VP } = await import('@nestjs/common');
  app.useGlobalPipes(
    new VP({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (!isProduction) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('SIAKAD API')
      .setDescription('School Academic Information System REST API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const documentFactory = () =>
      SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, documentFactory, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.init();
  return app;
}

export default async function handler(req: Request, res: Response) {
  const nestApp = await createApp();
  const expressApp = nestApp.getHttpAdapter().getInstance();
  return expressApp(req, res);
}