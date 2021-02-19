import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationException } from './jobvacancy/filter/validation.exception';
import { ValidationFilter } from './jobvacancy/filter/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // @TODO refactor error validations
  app.useGlobalFilters(new ValidationFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map(
          (error) => `${error.property} has wrong value ${error.value},
            ${Object.values(error.constraints).join(',')}`,
        );
        return new ValidationException(messages);
      },
    }),
  );

  // app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Pharma Connect API')
    .setDescription('Pharma Connect API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors();

  await app.listen(4500);
  console.log('server running on http://127.0.0.1:4500 : ' + new Date());
}
bootstrap();
