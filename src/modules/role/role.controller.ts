import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolePermissionsArrayDto } from './dto/permission.dto';
import { dataPermission } from 'src/common/data-permission/data-permission';
import { PrismaService } from 'src/prisma.service';
import { DeleteCascadeService } from 'src/shared/delete-cascade/delete-cascade.service';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interface';

// @Auth([Role.ADMIN])
@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly prisma: PrismaService,
    private readonly deleteCascade: DeleteCascadeService,
  ) {}

  @Post()
  create(@Body() createRoleDto: RolePermissionsArrayDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: RolePermissionsArrayDto,
  ) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @Auth(dataPermission.role.functions.remove)
  async remove(
    @Req() request: Request & { user: { role: string } },
    @Param('id') id: string,
  ) {
    console.log(request);

    let result;

    const deleteCascade = true;
    if (!deleteCascade) {
      try {
        result = await this.roleService.remove(+id);
      } catch (error) {
        console.log(error);
        console.log(error.meta);

        if (error.code == 'P2003') {
          return {
            message: `${error.meta.modelName} esta ligado a ${error.meta.field_name}`,
          };
        }

        return 'error';
      }
    } else {
      const resultInfoRelation = await this.deleteCascade.infoIdRelation(
        id,
        dataPermission.role.functions.remove,
      );

      const hasPermissions = this.deleteCascade.checkingPermissions(
        request.user.role,
        resultInfoRelation,
      );

      if (!hasPermissions) return;

      result = await this.deleteCascade.deleteRelations(
        [...resultInfoRelation].reverse(),
      );
    }

    return result;
  }

  // tests
  @Post('validacion-role')
  validacionRole(@Body() data: RolePermissionsArrayDto) {
    return this.roleService.createPermission(data);
  }
}
