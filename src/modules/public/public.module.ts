import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { RecipeModule } from '../recipe/recipe.module';

@Module({
  imports: [RecipeModule],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
