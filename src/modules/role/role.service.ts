import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma.service';
import { MemoRoleService } from 'src/modules/memo-role/memo-role.service';

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
