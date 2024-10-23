import { Controller, Get, Param, Post, Query } from '@nestjs/common';
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
  async findMatchesTitleRecipe(
    @Query('query') query,
    @Query('categories') categories,
  ) {
    return this.searchService.findMatchesRecipe([query, categories]);
    // return this.searchService.findMatchesTitleRecipe(query);
  }
}
