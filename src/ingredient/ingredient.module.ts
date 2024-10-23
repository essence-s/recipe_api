import { Module } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { IngredientController } from './ingredient.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [IngredientService, PrismaService],
  controllers: [IngredientController],
})
export class IngredientModule {}
