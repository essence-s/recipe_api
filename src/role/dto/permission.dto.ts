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

class AuthPermissionDto {
  @IsBoolean()
  create: boolean;

  @IsBoolean()
  delete: boolean;

  @IsBoolean()
  update: boolean;

  @IsBoolean()
  find: boolean;
}

class RecipePermissionDto {
  @IsBoolean()
  create: boolean;

  @IsBoolean()
  delete: boolean;
}

@ValidatorConstraint({ async: false })
export class ValidatePermissionDtoConstraint
  implements ValidatorConstraintInterface
{
  validate(permission: any, args: ValidationArguments) {
    const { name } = args.object as any;
    let dtoClass;

    switch (name) {
      case 'auth':
        dtoClass = AuthPermissionDto;
        break;
      case 'recipe':
        dtoClass = RecipePermissionDto;
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
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => GenericRolePermissionDto)
  permissions: GenericRolePermissionDto[];
}
