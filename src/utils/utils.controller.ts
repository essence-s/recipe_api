import { Body, Controller, Get, Post } from '@nestjs/common';
import { UtilsService } from './utils.service';

@Controller('utils')
export class UtilsController {
  constructor(private readonly utils: UtilsService) {}

  @Get('delete-all')
  async deleteAll() {
    return this.utils.deleteAll();
  }

  @Post('create-recipes')
  async createRecipes(@Body() recipes) {
    return this.utils.createRecipesUtils(recipes);
  }
}
