import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PendingRecipeService } from './pending-recipe.service';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageService } from 'src/shared/upload-image/upload-image.service';
import { CreatePendingRecipeDto } from './create-pending-recipe.dto';

// @Auth([Role.ADMIN])
@Controller('pending-recipe')
export class PendingRecipeController {
  constructor(
    private readonly pendingRecipeService: PendingRecipeService,
    private readonly uploadImageService: UploadImageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file,
    @Body() createRecipeDto: CreatePendingRecipeDto,
  ) {
    const resultData = await this.uploadImageService.createThumbnails(
      file.buffer,
    );
    const recipeWithImageUrl = {
      ...createRecipeDto,
      imageUrl: resultData.name,
    };
    // createRecipeDto.imageUrl = resultData.name;

    return await this.pendingRecipeService.createPendingRecipe(
      recipeWithImageUrl,
    );
  }

  @Get()
  async findAll(): Promise<{}> {
    return await this.pendingRecipeService.findAll();
  }

  @Post('pendingtorecipe/:id')
  async pendingToRecipe(@Param('id') id) {
    return await this.pendingRecipeService.migratePendingRecipeToRecipe(
      parseInt(id),
    );
    // return { id };
  }

  // TEST
  // @Post('prueba')
  // @UseInterceptors(FileInterceptor('image'))
  // async createPedingRecipe(
  //   @UploadedFile() file,
  //   @Body() body: CreatePendingRecipeDto,
  // ) {
  //   const resultData = await this.uploadImageService.createThumbnails(
  //     file.buffer,
  //   );
  //   const recipeWithImageUrl = {
  //     ...body,
  //     imageUrl: resultData.name,
  //   };
  //   // console.log(recipeWithImageUrl);

  //   // return {d:recipeWithImageUrl};
  // }
}
