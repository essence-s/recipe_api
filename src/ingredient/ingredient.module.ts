import { Module } from '@nestjs/common';
import { IngredientController } from './ingredient.controller';
import { IngredientService } from './ingredient.service';

@Module({
  providers: [IngredientService],
  controllers: [IngredientController],
})
export class IngredientModule {}
