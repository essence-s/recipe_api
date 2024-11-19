import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { RecipeModule } from '../recipe/recipe.module';
import { SearchModule } from '../search/search.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [RecipeModule, SearchModule, CategoryModule],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
