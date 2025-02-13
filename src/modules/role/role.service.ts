import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    return this.prisma.role.findMany({
      select: {
        id: true,
        name: true,
        permission: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.role.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        permission: true,
        createdAt: true,
        updatedAt: true,
      },
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
    await this.identifierSuperRole(id);
    const result = await this.prisma.role.delete({ where: { id } });
    if (result) this.memoRoleService.loadRoles();

    return result;
  }

  async identifierSuperRole(id: number) {
    const superRole = await this.prisma.role.findUnique({ where: { id } });

    if (!superRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    if (superRole.identifier == 'superrole') {
      throw new ForbiddenException('Cannot delete a superrole');
    }
  }
}
