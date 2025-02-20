import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { dataPermission } from 'src/common/data-permission/data-permission';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { CategoryGroupService } from './category-group.service';
import { CategoryGroupDto } from './dto/category-group';
import { RequestWithUser } from 'src/common/types/request-with-user.type';
import { DeleteCascadeService } from 'src/shared/delete-cascade/delete-cascade.service';

@Controller('category-group')
export class CategoryGroupController {
  constructor(
    private readonly categoryGroupService: CategoryGroupService,
    private readonly deleteCascade: DeleteCascadeService,
  ) {}

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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryGroupService.findOne(+id);
  }

  @Patch(':id')
  @Auth(dataPermission.categoryGroup.functions.update)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryGroupDto: CategoryGroupDto,
  ) {
    return this.categoryGroupService.update(+id, updateCategoryGroupDto);
  }

  @Delete(':id')
  @Auth(dataPermission.categoryGroup.functions.remove)
  remove(
    @Req() request: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Query('reassignTo') idReassign,
    @Query('deleteCascade') deleteCascade: boolean,
  ) {
    const dataPermisionG = dataPermission.categoryGroup.functions.remove;
    const userRole = request.role;

    const funDelete = async () => {
      return await this.categoryGroupService.remove(+id);
    };

    return this.deleteCascade.deleteCascadeOrReassign(
      funDelete,
      idReassign,
      deleteCascade,

      [+id],
      dataPermisionG,
      userRole,
    );
  }
}
