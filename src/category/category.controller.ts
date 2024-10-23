import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { categoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Post()
  async create(@Body() categories: categoryDto) {
    return this.categoryService.createCategory(categories);
  }
}
