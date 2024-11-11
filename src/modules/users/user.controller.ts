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

@Auth([Role.ADMIN])
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Auth([TYPE_REQUEST.CREATE])
  @Post()
  async create(@Body() createUserDto: UserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Delete()
  removeMany(@Body() ids: { ids: [] }) {
    return this.userService.removeMany(ids);
  }
}
