import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { AppModule } from 'src/app.module';
import { MemoRoleService } from 'src/shared/memo-role/memo-role.service';

const prisma = new PrismaClient();

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const memoRoleService = app.get(MemoRoleService);

  const data = memoRoleService.getRoles();
  console.log({ datos: data });
}

main()
  .then(async () => {
    console.log('Data create.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
