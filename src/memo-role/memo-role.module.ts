import { Global, Module } from '@nestjs/common';
import { MemoRoleService } from './memo-role.service';

@Global()
@Module({
  // controllers: [RoleController],
  providers: [MemoRoleService],
  exports: [MemoRoleService],
})
export class MemoRoleModule {}
