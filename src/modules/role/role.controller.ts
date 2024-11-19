import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
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
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  @Auth(dataPermission.role.functions.update)
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: RolePermissionsArrayDto,
  ) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @Auth()
  async remove(
    @Req() request: Request & { user: { role: string } },
    @Param('id') id: string,
    @Query('reassignTo') idReassign,
    @Query('deleteCascade') deleteCascade: boolean,
  ) {
    // console.log(request);
    const dataPermisionG = dataPermission.role.functions.remove;

    if (idReassign) {
      const resultReassing = await this.deleteCascade.reassign(
        id,
        dataPermisionG,
        idReassign,
        request.user.role,
      );

      return resultReassing;
    }

    if (!deleteCascade) {
      try {
        return await this.roleService.remove(+id);
      } catch (error) {
        if (error.code == 'P2003') {
          const resultInfoRelation = await this.deleteCascade.infoIdRelation(
            id,
            dataPermisionG,
          );
          return resultInfoRelation;
        }
        return error;
      }
    } else {
      return await this.deleteCascade.deleteCascade(
        id,
        dataPermisionG,
        request.user.role,
      );
    }
  }

  // tests
  @Post('validacion-role')
  validacionRole(@Body() data: RolePermissionsArrayDto) {
    return this.roleService.createPermission(data);
  }
}
