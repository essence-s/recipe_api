import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
// import { Recipe } from './recipe.entity';
// import { CreateRecipeDto } from './create-recipe.dto';
import { dataPermission } from 'src/common/data-permission/data-permission';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  // @Post()
  // async create(@Body() createRecipeDto): Promise<Recipe[]> {
  //   // async create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
  //   return await this.recipeService.create(createRecipeDto);
  // }
  @Post()
  @Auth(dataPermission.recipe.functions.create)
  async create(@Body() createRecipeDto) {
    // async create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return await this.recipeService.createRecipe(createRecipeDto);
  }

  @Get()
  @Auth(dataPermission.recipe.functions.findAll)
  async findAll(): Promise<{}> {
    // async findAll(): Promise<Recipe[]> {
    return await this.recipeService.findAll();
  }

  @Get(':id')
  @Auth(dataPermission.recipe.functions.findOne)
  async findOne(@Param('id') id) {
    return await this.recipeService.findId(parseInt(id));
    // return { id };
  }

  @Patch(':id')
  @Auth(dataPermission.recipe.functions.update)
  update(@Param('id') id: string, @Body() updateRecipeDto) {
    return this.recipeService.update(+id, updateRecipeDto);
  }

  @Delete(':id')
  @Auth(dataPermission.recipe.functions.remove)
  remove(@Param('id') id: string) {
    return this.recipeService.remove(+id);
  }

  @Post('pendingtorecipe/:id')
  async pendingToRecipe(@Param('id') id) {
    return await this.recipeService.migratePendingRecipeToRecipe(parseInt(id));
    // return { id };
  }
}
