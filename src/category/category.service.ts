import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { categoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany();
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
}
