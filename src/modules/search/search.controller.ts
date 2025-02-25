import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SearchPublicDto } from '../public/dto/search-public.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post(':category')
  async findCategory(@Param('category') category) {
    // return { category };
    return this.searchService.findCategory(category);
  }

  @Get('matches')
  async findMatchesTitleRecipe(@Query() queryG: SearchPublicDto) {
    const { query, categories, page, perPage } = queryG;

    return this.searchService.findMatchesRecipe([query, categories], {
      page,
      perPage,
    });
  }

  // @Get('matchesGG')
  // async findManyGG(@Query('query') query, @Query('categories') categories) {
  //   return this.searchService.findManyGG([query, categories]);
  //   // return this.searchService.findMatchesTitleRecipe(query);
  // }
}
