import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TYPE_REQUEST } from 'src/common/enums/type-request.enum';
import { MemoRoleService } from 'src/shared/memo-role/memo-role.service';
import { TYPE_REQUEST_KEY } from '../decorators/type-request.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly memoRoleService: MemoRoleService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const typeRequest = this.reflector.getAllAndOverride(
      // const typeRequest = this.reflector.getAllAndOverride<TYPE_REQUEST[]>(
      TYPE_REQUEST_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!typeRequest) {
      return true;
    }

    // const { user } = context.switchToHttp().getRequest();
    const contextRequest = context.switchToHttp().getRequest();

    // const urlRequest = contextRequest.originalUrl;
    // const match = urlRequest.match(/\/api\/v1\/([^/]+)/);
    // const result = match ? match[1] : null;
    // const method = contextRequest.method;

    const result = typeRequest.name;
    // const method = contextRequest.method;

    // const changeMethod = {
    //   GET: 'find',
    //   POST: 'create',
    //   DELETE: 'delete',
    //   PATCH: 'update',
    // };

    // const methodConvert = changeMethod[method];
    const methodConvert = typeRequest.typePermission;

    // console.log(result);
    const dataRole = this.memoRoleService
      .getRoles()
      .find((role) => role.name == contextRequest.user.role);

    if (!dataRole) {
      return false;
    }

    const booleanPermission = dataRole.permission.find(
      (permission) => permission.name == result,
    ).permission[methodConvert];

    console.log(booleanPermission);

    // const exists = roles.some((role) => role === user.role);

    return booleanPermission;
  }
}
