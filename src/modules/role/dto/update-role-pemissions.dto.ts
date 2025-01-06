import { PartialType } from '@nestjs/mapped-types';
import { RolePermissionsArrayDto } from './permission.dto';

export class UpdateRolePermissionsArrayDto extends PartialType(
  RolePermissionsArrayDto,
) {}
