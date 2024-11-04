import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RecipeService } from './recipe.service';
// import { Recipe } from './recipe.entity';
// import { CreateRecipeDto } from './create-recipe.dto';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';

@Auth([Role.ADMIN])
@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  // @Post()
  // async create(@Body() createRecipeDto): Promise<Recipe[]> {
  //   // async create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
  //   return await this.recipeService.create(createRecipeDto);
  // }
  @Post()
  async create(@Body() createRecipeDto) {
    // async create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return await this.recipeService.createRecipe(createRecipeDto);
  }

  @Get()
  async findAll(): Promise<{}> {
    // async findAll(): Promise<Recipe[]> {
    return await this.recipeService.findAll();
  }

  @Post(':id')
  async recipeId(@Param('id') id) {
    return await this.recipeService.findId(parseInt(id));
    // return { id };
  }

  @Post('pendingtorecipe/:id')
  async pendingToRecipe(@Param('id') id) {
    return await this.recipeService.migratePendingRecipeToRecipe(parseInt(id));
    // return { id };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipeService.remove(+id);
  }

  // @Get(':id')
  // async findOne(@Param('id') id: number): Promise<Recipe> {
  //   return await this.recipeService.findOne(id);
  // }
}
