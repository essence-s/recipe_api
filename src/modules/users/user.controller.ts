import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Role } from 'src/common/enums/role.enum';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { TYPE_REQUEST } from 'src/common/enums/type-request.enum';
import { dataPermission } from 'src/common/data-permission/data-permission';
import { DeleteCascadeService } from 'src/shared/delete-cascade/delete-cascade.service';

@Controller('user')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly deleteCascade: DeleteCascadeService,
  ) {}

  @Post()
  @Auth(dataPermission.user.functions.create)
  async create(@Body() createUserDto: UserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @Auth(dataPermission.user.functions.findAll)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Auth(dataPermission.user.functions.findOne)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @Auth(dataPermission.user.functions.update)
  update(@Param('id') id: string, @Body() updateUserDto: UserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Auth(dataPermission.user.functions.remove)
  async remove(@Param('id') id: string) {
    const dataPermisionG = dataPermission.user.functions.remove;

    try {
      return await this.userService.remove(+id);
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
  }

  @Delete()
  @Auth(dataPermission.user.functions.removeMany)
  removeMany(@Body() ids: { ids: [] }) {
    return this.userService.removeMany(ids);
  }
}
