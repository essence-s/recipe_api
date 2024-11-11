import { plainToInstance, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  registerDecorator,
  ValidateNested,
  validateSync,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

class RecipePermissionDto {
  @IsBoolean()
  create: boolean;

  @IsBoolean()
  delete: boolean;

  @IsBoolean()
  update: boolean;

  @IsBoolean()
  find: boolean;
}

class RecipePendingPermissionDto {
  @IsBoolean()
  create: boolean;

  @IsBoolean()
  delete: boolean;

  @IsBoolean()
  update: boolean;

  @IsBoolean()
  find: boolean;
}

class RolePermissionDto {
  @IsBoolean()
  create: boolean;

  @IsBoolean()
  delete: boolean;

  @IsBoolean()
  update: boolean;

  @IsBoolean()
  find: boolean;
}
class UsersPermissionDto {
  @IsBoolean()
  create: boolean;

  @IsBoolean()
  delete: boolean;

  @IsBoolean()
  update: boolean;

  @IsBoolean()
  find: boolean;
}
class CategoryPermissionDto {
  @IsBoolean()
  create: boolean;

  @IsBoolean()
  delete: boolean;

  @IsBoolean()
  update: boolean;

  @IsBoolean()
  find: boolean;
}

class CategoryGroupPermissionDto {
  @IsBoolean()
  create: boolean;

  @IsBoolean()
  delete: boolean;

  @IsBoolean()
  update: boolean;

  @IsBoolean()
  find: boolean;
}

@ValidatorConstraint({ async: false })
export class ValidatePermissionDtoConstraint
  implements ValidatorConstraintInterface
{
  validate(permission: any, args: ValidationArguments) {
    const { name } = args.object as any;
    let dtoClass;

    switch (name) {
      case 'recipe':
        dtoClass = RecipePermissionDto;
        break;
      case 'recipe-pending':
        dtoClass = RecipePendingPermissionDto;
        break;
      case 'role':
        dtoClass = RolePermissionDto;
        break;
      case 'user':
        dtoClass = UsersPermissionDto;
        break;
      case 'category':
        dtoClass = CategoryPermissionDto;
        break;
      case 'category-group':
        dtoClass = CategoryGroupPermissionDto;
        break;
      default:
        return false; // Nombre no reconocido
    }

    // Transforma y valida la estructura del permiso usando el DTO adecuado
    const dtoInstance = plainToInstance(dtoClass, permission);
    const errors = validateSync(dtoInstance) || [];

    return errors.length === 0;
  }

  defaultMessage(args: ValidationArguments) {
    return `La estructura de permisos para "${(args.object as any).name}" no es válida.`;
  }
}

export function ValidatePermissionDto(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidatePermissionDtoConstraint,
    });
  };
}

export class GenericRolePermissionDto {
  @IsString()
  name: string;

  @ValidatePermissionDto()
  permission: any;
}

export class RolePermissionsArrayDto {
  @IsOptional()
  id?: number;

  @IsString()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => GenericRolePermissionDto)
  permission: GenericRolePermissionDto[];
}
