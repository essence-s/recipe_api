import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { dataPermission } from 'src/common/data-permission/data-permission';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { DeleteCascadeService } from 'src/shared/delete-cascade/delete-cascade.service';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

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
  async remove(
    @Req() request: Request & { user: { role: string } },
    @Param('id') id: string,
    @Query('reassignTo') idReassign,
    @Query('deleteCascade') deleteCascade: boolean,
  ) {
    const dataPermisionG = dataPermission.user.functions.remove;
    const roleTokenRequest = request.user.role;

    const funDelete = async () => {
      return await this.userService.remove(+id);
    };

    return this.deleteCascade.deleteCascadeOrReassign(
      funDelete,
      idReassign,
      deleteCascade,

      id,
      dataPermisionG,
      roleTokenRequest,
    );
  }

  @Delete()
  @Auth(dataPermission.user.functions.removeMany)
  removeMany(@Body() ids: { ids: [] }) {
    return this.userService.removeMany(ids);
  }
}
