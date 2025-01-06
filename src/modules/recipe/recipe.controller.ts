import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { dataPermission } from 'src/common/data-permission/data-permission';
import { RequestWithUser } from 'src/common/types/request-with-user.type';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { UploadImageService } from 'src/shared/upload-image/upload-image.service';
import { CreateRecipeDto } from './create-recipe.dto';
import { RecipeService } from './recipe.service';
import { UpdateRecipeDto } from './update-recipe.dto';

@Controller('recipe')
export class RecipeController {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly uploadImageService: UploadImageService,
  ) {}

  @Post()
  @Auth(dataPermission.recipe.functions.create)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Req() request: RequestWithUser,
    @UploadedFile() file,
    @Body() createRecipeDto: CreateRecipeDto,
  ) {
    const resultData = await this.uploadImageService.createThumbnails(
      file.buffer,
    );
    const recipeWithImageUrl = {
      ...createRecipeDto,
      imageUrl: resultData.name,
      userId: request.user.userId,
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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.recipeService.findId(+id);
    // return { id };
  }

  @Patch(':id')
  @Auth(dataPermission.recipe.functions.update)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @UploadedFile() file,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    // eliminamos la imagen anterior
    const recipe = await this.recipeService.findId(+id);

    const resultData = await this.uploadImageService.updateThumbnails(
      recipe.imageUrl,
      file.buffer,
    );

    const recipeWithImageUrl = {
      ...updateRecipeDto,
      imageUrl: resultData.name,
    };

    return this.recipeService.update(+id, recipeWithImageUrl);
  }

  @Delete(':id')
  @Auth(dataPermission.recipe.functions.remove)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const recipe = await this.recipeService.findId(+id);
    await this.uploadImageService.deleteThumbnails(recipe.imageUrl);
    return this.recipeService.remove(+id);
  }
}
