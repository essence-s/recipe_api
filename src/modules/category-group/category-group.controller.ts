import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryGroupService } from './category-group.service';
import { CategoryGroupDto } from './dto/category-group';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';

@Auth([Role.ADMIN])
@Controller('category-group')
export class CategoryGroupController {
  constructor(private readonly categoryGroupService: CategoryGroupService) {}

  @Post()
  create(@Body() createCategoryGroupDto: CategoryGroupDto) {
    return this.categoryGroupService.create(createCategoryGroupDto);
  }

  @Get()
  findAll() {
    return this.categoryGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryGroupService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryGroupDto: CategoryGroupDto,
  ) {
    return this.categoryGroupService.update(+id, updateCategoryGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryGroupService.remove(+id);
  }
}
