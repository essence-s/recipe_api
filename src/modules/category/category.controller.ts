import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { dataPermission } from 'src/common/data-permission/data-permission';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { CategoryService } from './category.service';
import { categoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Auth(dataPermission.category.functions.create)
  async create(@Body() categories: categoryDto) {
    return this.categoryService.createCategory(categories);
  }

  @Get()
  @Auth(dataPermission.category.functions.findAll)
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @Auth(dataPermission.category.functions.findOne)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @Auth(dataPermission.category.functions.update)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto) {
    return this.categoryService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Auth(dataPermission.category.functions.remove)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(+id);
  }
}
