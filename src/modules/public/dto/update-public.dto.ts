import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicPendingRecipeDto } from './create-public.dto';

export class UpdatePublicDto extends PartialType(
  CreatePublicPendingRecipeDto,
) {}
