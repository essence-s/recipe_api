import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  create(createRoleDto) {
    return this.prisma.role.create({ data: createRoleDto });
  }

  createPermission(createRoleDto) {
    return this.prisma.role.create({ data: createRoleDto });
  }

  findAll() {
    return this.prisma.role.findMany();
  }

  findOne(id: number) {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  update(id: number, updateRoleDto) {
    return this.prisma.role.update({ where: { id }, data: updateRoleDto });
  }

  remove(id: number) {
    return this.prisma.role.delete({ where: { id } });
  }
}
