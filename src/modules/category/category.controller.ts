import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { categoryDto } from './dto/category.dto';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { dataPermission } from 'src/common/data-permission/data-permission';

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
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @Auth(dataPermission.category.functions.update)
  update(@Param('id') id: string, @Body() updateUserDto) {
    return this.categoryService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Auth(dataPermission.category.functions.remove)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
