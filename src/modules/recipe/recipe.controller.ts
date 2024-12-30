import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { dataPermission } from 'src/common/data-permission/data-permission';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRecipeDto } from './create-recipe.dto';
import { UploadImageService } from 'src/shared/upload-image/upload-image.service';
import { UpdateRecipeDto } from './update-recipe.dto';
import { RequestWithUser } from 'src/common/types/request-with-user.type';

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
  async findOne(@Param('id') id) {
    return await this.recipeService.findId(parseInt(id));
    // return { id };
  }

  @Patch(':id')
  @Auth(dataPermission.recipe.functions.update)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @UploadedFile() file,
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    // eliminamos la imagen anterior
    const recipe = await this.recipeService.findId(parseInt(id));

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
  async remove(@Param('id') id: string) {
    const recipe = await this.recipeService.findId(parseInt(id));
    await this.uploadImageService.deleteThumbnails(recipe.imageUrl);
    return this.recipeService.remove(+id);
  }
}
