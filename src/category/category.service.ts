import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { categoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        group: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async createCategory(categories: categoryDto) {
    try {
      return await this.prisma.category.createMany({ data: categories });
    } catch (error) {
      //No in production messague :V error.meta
      const infoError = error.meta.target ? 'Exist' : 'Error create category';
      throw new BadRequestException(infoError);
    }
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        groupId: true,
        group: {
          select: { id: true, name: true },
        },
      },
    });
  }

  update(id: number, data) {
    return this.prisma.category.update({ where: { id }, data: data });
  }

  remove(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
