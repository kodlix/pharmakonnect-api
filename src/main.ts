/* eslint-disable prettier/prettier */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { v2 } from "cloudinary";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Pharma Connect API')
    .setDescription('Pharma Connect API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  v2.config({
    cloud_name: 'netop',
    api_key: '573133829512798',
    api_secret: 'plXN0UZA8s0dvLZ6Zh0N4fZwais'
  });

  app.enableCors();
  await app.listen(process.env.PORT || 4500);
  console.log(`server running on ${await app.getUrl()} : ` + new Date());
}
bootstrap();