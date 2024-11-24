import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PendingRecipeService } from './pending-recipe.service';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';

// @Auth([Role.ADMIN])
@Controller('pending-recipe')
export class PendingRecipeController {
  constructor(private readonly pendingRecipeService: PendingRecipeService) {}

  @Post()
  async create(@Body() createRecipeDto) {
    return await this.pendingRecipeService.createPendingRecipe(createRecipeDto);
  }

  @Get()
  async findAll(): Promise<{}> {
    return await this.pendingRecipeService.findAll();
  }

  @Post('pendingtorecipe/:id')
  async pendingToRecipe(@Param('id') id) {
    return await this.pendingRecipeService.migratePendingRecipeToRecipe(
      parseInt(id),
    );
    // return { id };
  }
}
