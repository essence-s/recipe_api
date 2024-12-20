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
import { PrismaService } from 'src/prisma.service';
import { DeleteCascadeService } from 'src/shared/delete-cascade/delete-cascade.service';
import { RolePermissionsArrayDto } from './dto/permission.dto';
import { RoleService } from './role.service';

// @Auth([Role.ADMIN])
@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly prisma: PrismaService,
    private readonly deleteCascade: DeleteCascadeService,
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
    @Body() updateRoleDto: RolePermissionsArrayDto,
  ) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @Auth()
  async remove(
    @Req() request: Request & { user: { role: string } },
    @Param('id', ParseIntPipe) id: number,
    @Query('reassignTo') idReassign,
    @Query('deleteCascade') deleteCascade: boolean,
  ) {
    // console.log(request);
    const dataPermisionG = dataPermission.role.functions.remove;
    const roleTokenRequest = request.user.role;

    const funDelete = async () => {
      return await this.roleService.remove(+id);
    };

    return this.deleteCascade.deleteCascadeOrReassign(
      funDelete,
      idReassign,
      deleteCascade,

      [+id],
      dataPermisionG,
      roleTokenRequest,
    );
  }

  // tests
  @Post('validacion-role')
  validacionRole(@Body() data: RolePermissionsArrayDto) {
    return this.roleService.createPermission(data);
  }
}
