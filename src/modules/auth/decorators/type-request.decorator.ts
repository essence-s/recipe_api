import { SetMetadata } from '@nestjs/common';
import { TYPE_REQUEST } from 'src/common/enums/type-request.enum';

export const TYPE_REQUEST_KEY = 'type-request';

export const Roles = (typeRequest) =>
  SetMetadata(TYPE_REQUEST_KEY, typeRequest);
