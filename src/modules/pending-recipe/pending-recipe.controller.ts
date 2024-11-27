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

// @Auth([Role.ADMIN])
@Controller('pending-recipe')
export class PendingRecipeController {
  constructor(
    private readonly pendingRecipeService: PendingRecipeService,
    private readonly uploadImageService: UploadImageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@UploadedFile() file, @Body() createRecipeDto) {
    const resultData = await this.uploadImageService.createThumbnails(
      file.buffer,
    );
    createRecipeDto.imageUrl = resultData.name;

    return await this.pendingRecipeService.createPendingRecipe(createRecipeDto);
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
  @Post('prueba')
  @UseInterceptors(FileInterceptor('image'))
  async createPedingRecipe(@UploadedFile() file, @Body() body) {
    // return NextResponse.json(await createThumbnails());
    // console.log(await request.formData());
    // const resultData = await this.uploadImageService.createThumbnails(
    //   file.buffer,
    // );

    // body.imageUrl = resultData.name;
    console.log(body);
    // console.log(file);
    // return { hola: 'hello' };
    // return this.uploadImageService.createThumbnails(file.buffer);
    return body;
  }
}
