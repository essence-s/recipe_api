import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { dataPermission } from 'src/common/data-permission/data-permission';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { CategoryGroupService } from './category-group.service';
import { CategoryGroupDto } from './dto/category-group';

@Controller('category-group')
export class CategoryGroupController {
  constructor(private readonly categoryGroupService: CategoryGroupService) {}

  @Post()
  @Auth(dataPermission.categoryGroup.functions.create)
  create(@Body() createCategoryGroupDto: CategoryGroupDto) {
    return this.categoryGroupService.create(createCategoryGroupDto);
  }

  @Get()
  @Auth(dataPermission.categoryGroup.functions.findAll)
  findAll() {
    return this.categoryGroupService.findAll();
  }

  @Get(':id')
  @Auth(dataPermission.categoryGroup.functions.findOne)
  findOne(@Param('id') id: string) {
    return this.categoryGroupService.findOne(+id);
  }

  @Patch(':id')
  @Auth(dataPermission.categoryGroup.functions.update)
  update(
    @Param('id') id: string,
    @Body() updateCategoryGroupDto: CategoryGroupDto,
  ) {
    return this.categoryGroupService.update(+id, updateCategoryGroupDto);
  }

  @Delete(':id')
  @Auth(dataPermission.categoryGroup.functions.remove)
  remove(@Param('id') id: string) {
    return this.categoryGroupService.remove(+id);
  }
}
