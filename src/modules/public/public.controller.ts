import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RecipeService } from '../recipe/recipe.service';
import { PublicService } from './public.service';
import { SearchService } from '../search/search.service';
import { CategoryService } from '../category/category.service';
import { PendingRecipeService } from '../pending-recipe/pending-recipe.service';
import { CategoryGroupService } from '../category-group/category-group.service';

@Controller('public')
export class PublicController {
  constructor(
    private readonly publicService: PublicService,
    private readonly recipeService: RecipeService,
    private readonly searchService: SearchService,
    private readonly categoryService: CategoryService,
    private readonly categoryGroupService: CategoryGroupService,
    private readonly pendingRecipe: PendingRecipeService,
  ) {}

  @Get('recipe/:id')
  findOne(@Param('id') id) {
    return this.recipeService.findId(+id);
  }

  @Get('search/matches')
  async findMatchesTitleRecipe(
    @Query('query') query,
    @Query('categories') categories,
    @Query('page') page,
    @Query('perPage') perPage,
  ) {
    return this.searchService.findMatchesRecipe([query, categories], {
      page,
      perPage,
    });
  }

  @Get('category')
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('category-group')
  findAllCG() {
    return this.categoryGroupService.findAll();
  }

  @Post('pendingRecipe')
  async create(@Body() createPendingRecipe) {
    return await this.pendingRecipe.createPendingRecipe(createPendingRecipe);
  }

  // @Post()
  // create(@Body() createPublicDto: CreatePublicDto) {
  //   return this.publicService.create(createPublicDto);
  // }

  // @Get()
  // findAll() {
  //   return this.publicService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.publicService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePublicDto: UpdatePublicDto) {
  //   return this.publicService.update(+id, updatePublicDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.publicService.remove(+id);
  // }
}
