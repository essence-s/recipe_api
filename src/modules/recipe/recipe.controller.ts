import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
// import { Recipe } from './recipe.entity';
// import { CreateRecipeDto } from './create-recipe.dto';
import { dataPermission } from 'src/common/data-permission/data-permission';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRecipeDto } from './create-recipe.dto';
import { UploadImageService } from 'src/shared/upload-image/upload-image.service';

@Controller('recipe')
export class RecipeController {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly uploadImageService: UploadImageService,
  ) {}

  // @Post()
  // async create(@Body() createRecipeDto): Promise<Recipe[]> {
  //   // async create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
  //   return await this.recipeService.create(createRecipeDto);
  // }
  @Post()
  @Auth(dataPermission.recipe.functions.create)
  @UseInterceptors(FileInterceptor('image'))
  async create(@UploadedFile() file, @Body() createRecipeDto: CreateRecipeDto) {
    const resultData = await this.uploadImageService.createThumbnails(
      file.buffer,
    );
    const recipeWithImageUrl = {
      ...createRecipeDto,
      imageUrl: resultData.name,
    };
    return await this.recipeService.createRecipe(recipeWithImageUrl);
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
  async remove(@Param('id') id: string) {
    const recipe = await this.recipeService.findId(parseInt(id));
    await this.uploadImageService.deleteThumbnails(recipe.imageUrl);
    return this.recipeService.remove(+id);
  }
}
