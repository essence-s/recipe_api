import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MemoRoleService } from './modules/memo-role/memo-role.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const memoRoleService = app.get(MemoRoleService);
  await memoRoleService.loadRoles();

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    // origin: 'http://localhost:3001',
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(parseInt(process.env.PORT) || 3004);
}
bootstrap();
