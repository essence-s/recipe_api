// import { ValidationPipe } from '@nestjs/common';
import { plainToInstance, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
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
  view: boolean;
}

class PendingRecipePermissionDto {
  @IsBoolean()
  create: boolean;

  @IsBoolean()
  delete: boolean;

  @IsBoolean()
  update: boolean;

  @IsBoolean()
  view: boolean;

  @IsBoolean()
  approve: boolean;
}

class RolePermissionDto {
  @IsBoolean()
  create: boolean;

  @IsBoolean()
  delete: boolean;

  @IsBoolean()
  update: boolean;

  @IsBoolean()
  view: boolean;
}
class UsersPermissionDto {
  @IsBoolean()
  create: boolean;

  @IsBoolean()
  delete: boolean;

  @IsBoolean()
  update: boolean;

  @IsBoolean()
  view: boolean;
}
class CategoryPermissionDto {
  @IsBoolean()
  create: boolean;

  @IsBoolean()
  delete: boolean;

  @IsBoolean()
  update: boolean;

  @IsBoolean()
  view: boolean;
}

class CategoryGroupPermissionDto {
  @IsBoolean()
  create: boolean;

  @IsBoolean()
  delete: boolean;

  @IsBoolean()
  update: boolean;

  @IsBoolean()
  view: boolean;
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
      case 'pendingRecipe':
        dtoClass = PendingRecipePermissionDto;
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
      case 'categoryGroup':
        dtoClass = CategoryGroupPermissionDto;
        break;
      default:
        return false; // Nombre no reconocido
    }

    // Transforma y valida la estructura del permiso usando el DTO adecuado
    const dtoInstance = plainToInstance(dtoClass, permission);
    const errors =
      validateSync(dtoInstance, {
        whitelist: true,
        forbidNonWhitelisted: true,
      }) || [];

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
  @IsString()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => GenericRolePermissionDto)
  permission: GenericRolePermissionDto[];
}
