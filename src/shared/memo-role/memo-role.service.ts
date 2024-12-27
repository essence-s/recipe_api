import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MemoRoleService {
  private roles: Role[] = [];

  constructor(private readonly prisma: PrismaService) {}

  // Cargar roles desde la base de datos
  async loadRoles() {
    this.roles = await this.prisma.role.findMany();
    // console.log(this.roles.map((role) => role.permission));
  }

  // Obtener la lista de roles
  getRoles() {
    return this.roles;
  }
}
