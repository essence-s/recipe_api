import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MemoRoleService {
  private roles: Role[] = [];

  constructor(private readonly prisma: PrismaService) {}

  // Cargar roles desde la base de datos
  async loadRoles() {
    // console.log('loadRoles');
    this.roles = await this.prisma.role.findMany();
  }

  // Obtener la lista de roles
  async getRoles() {
    if (this.roles.length === 0) {
      await this.loadRoles();
      if (this.roles.length === 0) {
        throw new InternalServerErrorException(
          'Check the seed because no roles were found.',
        );
      }
    }

    return this.roles;
  }
}
