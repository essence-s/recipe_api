import { Body, Controller, Get, Post } from '@nestjs/common';
import { IngredientService } from './ingredient.service';

@Controller('ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  async createIngredient(@Body() ingredients) {
    // console.log('dadad', ingredients);

    return this.ingredientService.createIngredient(ingredients);
  }

  @Get()
  async findAll() {
    return this.ingredientService.findAll();
    // return { hola: 'hola' };
  }
}
