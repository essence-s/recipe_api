import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MemoRoleService } from 'src/shared/memo-role/memo-role.service';

@Injectable()
export class RoleService {
  constructor(
    private prisma: PrismaService,
    private memoRoleService: MemoRoleService,
  ) {}

  async create(createRoleDto) {
    const result = await this.prisma.role.create({ data: createRoleDto });

    if (result) this.memoRoleService.loadRoles();

    return result;
  }

  // test
  async createPermission(createRoleDto) {
    const result = await this.prisma.role.create({ data: createRoleDto });
    if (result) this.memoRoleService.loadRoles();
    return result;
  }

  findAll() {
    return this.prisma.role.findMany();
  }

  findOne(id: number) {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateRoleDto) {
    const role = await this.findOne(id);
    if (role.identifier == 'superrole') {
    }

    const result = await this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });
    if (result) this.memoRoleService.loadRoles();

    return result;
  }

  async remove(id: number) {
    const result = await this.prisma.role.delete({ where: { id } });
    if (result) this.memoRoleService.loadRoles();

    return result;
  }
}
