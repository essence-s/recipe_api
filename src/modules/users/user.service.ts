import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CryptoService } from 'src/shared/crypto/crypto.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {}

  async create(register: UserDto) {
    try {
      return await this.prisma.user.create({
        data: {
          username: register.username,
          email: register.email,
          password: this.cryptoService.encryptPassword(register.password),
          // password: await bcrypt.hash(register.password, 10),
          roleId: register.roleId,
          phone: register.phone,
          state: register.state,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  findOneByPhoneOrEmail(phoneOrEmail: string) {
    return this.prisma.user.findFirst({
      where: { OR: [{ phone: phoneOrEmail }, { email: phoneOrEmail }] },
      include: {
        role: {
          select: {
            name: true,
            id: true,
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
    try {
      const data = {
        username: updateUserDto.username,
        email: updateUserDto.email,
        password: updateUserDto.password
          ? this.cryptoService.encryptPassword(updateUserDto.password)
          : null,
        // password: this.cryptoService.encryptPassword(updateUserDto.password),
        // password: await bcrypt.hash(updateUserDto.password, 10),
        roleId: updateUserDto.roleId,
        phone: updateUserDto.phone,
        state: updateUserDto.state,
      };

      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value != null),
      );

      return await this.prisma.user.update({
        where: { id },
        data: cleanedData,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number) {
    await this.identifierSuperUser(id);
    return this.prisma.user.delete({
      where: { id },
    });
  }

  removeMany(ids: { ids: [] }) {
    return this.prisma.user.deleteMany({
      where: { id: { in: ids.ids } },
    });
  }

  async identifierSuperUser(id: number) {
    const superUser = await this.prisma.user.findUnique({ where: { id } });

    if (!superUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (superUser.identifier == 'superuser') {
      throw new ForbiddenException('Cannot delete a superuser');
    }
  }

  async viewPassword(id: number) {
    const data = await this.prisma.user.findUnique({
      where: { id },
      select: {
        password: true,
      },
    });
    return {
      password: this.cryptoService.decryptPassword(data.password),
    };
  }
}
