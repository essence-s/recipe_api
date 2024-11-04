import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(register: CreateUserDto) {
    // create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        id: register.id,
        username: register.username,
        email: register.email,
        password: await bcrypt.hash(register.password, 10),
        roleId: register.roleId,
        phone: register.phone,
        state: register.state,
      },
    });
  }

  findOneByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  findOneByPhoneOrEmail(phoneOrEmail: string) {
    return this.prisma.user.findFirst({
      where: { OR: [{ phone: phoneOrEmail }, { email: phoneOrEmail }] },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        password: true,
        state: true,
        createdAt: true,
        updatedAt: true,

        role: {
          select: { id: true, name: true },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        password: true,
        state: true,
        createdAt: true,
        updatedAt: true,

        role: {
          select: { id: true, name: true },
        },
      },
    });
  }

  update(id: number, updateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
