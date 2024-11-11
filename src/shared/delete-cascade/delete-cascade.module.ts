import { Global, Module } from '@nestjs/common';
import { DeleteCascadeService } from './delete-cascade.service';

@Global()
@Module({
  providers: [DeleteCascadeService],
  exports: [DeleteCascadeService],
})
export class DeleteCascadeModule {}
