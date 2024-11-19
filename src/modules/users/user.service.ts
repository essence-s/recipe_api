import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(register: UserDto) {
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        id: updateUserDto.id,
        username: updateUserDto.username,
        email: updateUserDto.email,
        password: await bcrypt.hash(updateUserDto.password, 10),
        roleId: updateUserDto.roleId,
        phone: updateUserDto.phone,
        state: updateUserDto.state,
      },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  removeMany(ids: { ids: [] }) {
    return this.prisma.user.deleteMany({
      where: { id: { in: ids.ids } },
    });
  }
}