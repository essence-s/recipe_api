import { Module } from '@nestjs/common';
import { PendingRecipeController } from './pending-recipe.controller';
import { PendingRecipeService } from './pending-recipe.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PendingRecipeController],
  providers: [PendingRecipeService, PrismaService],
})
export class PendingRecipeModule {}
