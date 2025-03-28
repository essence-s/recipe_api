import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { RecipeModule } from '../recipe/recipe.module';
import { SearchModule } from '../search/search.module';
import { CategoryModule } from '../category/category.module';
import { PendingRecipeModule } from '../pending-recipe/pending-recipe.module';
import { CategoryGroupModule } from '../category-group/category-group.module';
import { ContactModule } from '../contact/contact.module';

@Module({
  imports: [
    RecipeModule,
    SearchModule,
    CategoryModule,
    CategoryGroupModule,
    PendingRecipeModule,
    ContactModule,
  ],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
