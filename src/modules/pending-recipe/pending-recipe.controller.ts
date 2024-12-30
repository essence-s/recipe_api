import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { dataPermission } from 'src/common/data-permission/data-permission';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { UploadImageService } from 'src/shared/upload-image/upload-image.service';
import { CreatePendingRecipeDto } from './create-pending-recipe.dto';
import { PendingRecipeService } from './pending-recipe.service';
import { RequestWithUser } from 'src/common/types/request-with-user.type';

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
  @Auth(dataPermission.pendingRecipe.functions.pendingToRecipe)
  async pendingToRecipe(@Req() request: RequestWithUser, @Param('id') id) {
    return await this.pendingRecipeService.migratePendingRecipeToRecipe(
      parseInt(id),
      request.user.userId,
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
