import { Module } from '@nestjs/common';
import { PendingRecipeController } from './pending-recipe.controller';
import { PendingRecipeService } from './pending-recipe.service';

@Module({
  controllers: [PendingRecipeController],
  providers: [PendingRecipeService],
})
export class PendingRecipeModule {}
