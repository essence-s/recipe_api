import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Hace que el módulo sea accesible en toda la aplicación sin necesidad de importarlo en cada módulo.
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
