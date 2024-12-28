import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

    const contextRequest = context.switchToHttp().getRequest();
    const result = typeRequest.name;
    const methodConvert = typeRequest.typePermission;

    // console.log(result);
    const dataRole = this.memoRoleService
      .getRoles()
      .find((role) => role.id == contextRequest.user.idRole);

    // console.log(dataRole);
    if (!dataRole) {
      return false;
    }

    const tokenDate = new Date(contextRequest.user.iat * 1000);
    const dateUpdateAtRole = new Date(dataRole.updatedAt);
    if (!contextRequest.user?.iat || !dataRole?.updatedAt) {
      throw new UnauthorizedException('Invalid token or role data');
    }
    if (tokenDate < dateUpdateAtRole) {
      throw new UnauthorizedException(
        `Token expired. Role was updated on ${dateUpdateAtRole.toISOString()}`,
      );
    }

    const booleanPermission = (dataRole.permission as any[]).find(
      (permission: any) => permission.name == result,
    )?.permission[methodConvert];

    // console.log(booleanPermission);

    return booleanPermission;
  }
}
