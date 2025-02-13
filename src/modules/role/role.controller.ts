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
import { RequestWithUser } from 'src/common/types/request-with-user.type';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { DeleteCascadeService } from 'src/shared/delete-cascade/delete-cascade.service';
import { MemoRoleService } from 'src/shared/memo-role/memo-role.service';
import { RolePermissionsArrayDto } from './dto/permission.dto';
import { RoleService } from './role.service';
import { UpdateRolePermissionsArrayDto } from './dto/update-role-pemissions.dto';

@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly deleteCascade: DeleteCascadeService,
    private readonly memoRoleService: MemoRoleService,
  ) {}

  @Post()
  @Auth(dataPermission.role.functions.create)
  create(@Body() createRoleDto: RolePermissionsArrayDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @Auth(dataPermission.role.functions.findAll)
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @Auth(dataPermission.role.functions.findOne)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  @Auth(dataPermission.role.functions.update)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRolePermissionsArrayDto,
  ) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @Auth(dataPermission.role.functions.remove)
  async remove(
    @Req() request: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Query('reassignTo') idReassign,
    @Query('deleteCascade') deleteCascade: boolean,
  ) {
    // console.log(request);
    const dataPermisionG = dataPermission.role.functions.remove;
    const userRole = request.role;

    const funDelete = async () => {
      return await this.roleService.remove(+id);
    };

    const result = await this.deleteCascade.deleteCascadeOrReassign(
      funDelete,
      idReassign,
      deleteCascade,

      [+id],
      dataPermisionG,
      userRole,
    );

    this.memoRoleService.loadRoles();

    return result;
  }

  // tests
  @Post('validacion-role')
  validacionRole(@Body() data: RolePermissionsArrayDto) {
    return this.roleService.createPermission(data);
  }
}
