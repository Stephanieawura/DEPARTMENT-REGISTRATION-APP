import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { PrismaClientExceptionFilter } from './common/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(helmet()); // Secure HTTP headers
  app.enableCors(); // So React Native can connect locally
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  
  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Department Registration API')
    .setDescription('The API description for the React Native App')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
