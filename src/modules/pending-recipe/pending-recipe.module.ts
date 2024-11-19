import { Module } from '@nestjs/common';
import { PendingRecipeController } from './pending-recipe.controller';
import { PendingRecipeService } from './pending-recipe.service';

@Module({
  controllers: [PendingRecipeController],
  providers: [PendingRecipeService],
  exports: [PendingRecipeService],
})
export class PendingRecipeModule {}
