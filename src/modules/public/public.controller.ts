import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageService } from 'src/shared/upload-image/upload-image.service';
import { CategoryGroupService } from '../category-group/category-group.service';
import { CategoryService } from '../category/category.service';
import { PendingRecipeService } from '../pending-recipe/pending-recipe.service';
import { RecipeService } from '../recipe/recipe.service';
import { SearchService } from '../search/search.service';
import { CreatePublicPendingRecipeDto } from './dto/create-public.dto';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(
    private readonly publicService: PublicService,
    private readonly recipeService: RecipeService,
    private readonly searchService: SearchService,
    private readonly categoryService: CategoryService,
    private readonly categoryGroupService: CategoryGroupService,
    private readonly pendingRecipeService: PendingRecipeService,
    private readonly uploadImageService: UploadImageService,
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

  // @Post('pendingRecipe')
  // async create(@Body() createPendingRecipe) {
  //   return await this.pendingRecipeService.createPendingRecipe(
  //     createPendingRecipe,
  //   );
  // }

  @Post('pendingRecipe')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file,
    @Body() createRecipeDto: CreatePublicPendingRecipeDto,
  ) {
    const resultData = await this.uploadImageService.createThumbnails(
      file.buffer,
    );
    const pendingRecipeWithImageUrl = {
      ...createRecipeDto,
      imageUrl: resultData.name,
      // imageUrl: 'XD',
    };
    // createRecipeDto.imageUrl = resultData.name;

    return await this.pendingRecipeService.createPendingRecipe(
      pendingRecipeWithImageUrl,
    );
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
