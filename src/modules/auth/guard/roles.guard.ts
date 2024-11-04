import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import { MemoRoleService } from 'src/modules/memo-role/memo-role.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly memoRoleService: MemoRoleService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    // const { user } = context.switchToHttp().getRequest();
    const contextRequest = context.switchToHttp().getRequest();
    // console.log(contextRequest);

    const validRoles = this.memoRoleService.getRoles().map((role) => role.name);

    const exists = validRoles.some((role) => role === contextRequest.user.role);

    if (!exists) {
      return false;
    }

    const urlRequest = contextRequest.originalUrl;
    const match = urlRequest.match(/\/api\/v1\/([^/]+)/);
    const result = match ? match[1] : null;
    const method = contextRequest.method;

    const changeMethod = {
      GET: 'find',
      POST: 'create',
      DELETE: 'delete',
      PATCH: 'update',
    };

    const methodConvert = changeMethod[method];

    // console.log(result);
    const dataRole = this.memoRoleService
      .getRoles()
      .find((role) => role.name == contextRequest.user.role);

    const booleanPermission = dataRole.permission.find(
      (permission) => permission.name == result,
    ).permission[methodConvert];

    console.log(booleanPermission);

    // const exists = roles.some((role) => role === user.role);

    return booleanPermission;
  }
}
