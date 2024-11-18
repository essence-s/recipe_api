import { applyDecorators, UseGuards } from '@nestjs/common';
import { TYPE_REQUEST } from 'src/common/enums/type-request.enum';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from './type-request.decorator';

export function Auth(typeRequest?) {
  return applyDecorators(Roles(typeRequest), UseGuards(AuthGuard, RolesGuard));
}
