import { Controller, Get, Param } from '@nestjs/common';
import { RecipeService } from '../recipe/recipe.service';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(
    private readonly publicService: PublicService,
    private readonly recipeService: RecipeService,
  ) {}

  @Get('recipe/:id')
  findOne(@Param('id') id) {
    return this.recipeService.findId(+id);
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
