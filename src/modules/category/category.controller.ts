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
import { CategoryService } from './category.service';
import { categoryDto } from './dto/category.dto';
import { RequestWithUser } from 'src/common/types/request-with-user.type';
import { DeleteCascadeService } from 'src/shared/delete-cascade/delete-cascade.service';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly deleteCascade: DeleteCascadeService,
  ) {}

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
  remove(
    @Req() request: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Query('reassignTo') idReassign,
    @Query('deleteCascade') deleteCascade: boolean,
  ) {
    const dataPermisionG = dataPermission.category.functions.remove;
    const userRole = request.role;

    const funDelete = async () => {
      return await this.categoryService.remove(+id);
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
