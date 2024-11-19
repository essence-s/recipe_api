import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { RecipeModule } from '../recipe/recipe.module';
import { SearchModule } from '../search/search.module';
import { CategoryModule } from '../category/category.module';
import { PendingRecipeModule } from '../pending-recipe/pending-recipe.module';

@Module({
  imports: [RecipeModule, SearchModule, CategoryModule, PendingRecipeModule],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
