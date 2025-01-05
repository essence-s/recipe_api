import { Body, Controller, Get, Post } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { MemoRoleService } from 'src/shared/memo-role/memo-role.service';

@Controller('utils')
export class UtilsController {
  constructor(
    private readonly utils: UtilsService,
    private readonly memoRoleService: MemoRoleService,
  ) {}

  @Get('delete-all')
  async deleteAll() {
    return this.utils.deleteAll();
  }

  @Post('create-recipes')
  async createRecipes(@Body() recipes) {
    return this.utils.createRecipesUtils(recipes);
  }

  @Post('util-create-roles')
  async utilCreateManyRoles(@Body() roles) {
    return this.utils.utilCreateManyRoles(roles);
  }

  @Get('get-memory-roles')
  async getMemoryRoles() {
    return this.memoRoleService.getRoles();
  }
}
