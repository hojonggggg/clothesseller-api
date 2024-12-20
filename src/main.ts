import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commons/filters/http-exception.filter';
import * as fs from 'fs';

async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: fs.readFileSync('/etc/letsencrypt/live/clothesseller235.cafe24.com/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/clothesseller235.cafe24.com/fullchain.pem'),
    },
  });
  const configService = app.get(ConfigService);

  app.enableCors({
    /*
    origin: [
      'https://clothesseller235.cafe24.com',
      'http://172.30.1.21:3099', 
      '*'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    //credentials: true,
    */
    
    origin: (origin, callback) => {
      callback(null, true); // 모든 도메인 허용
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('clothesseller API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}
bootstrap();
