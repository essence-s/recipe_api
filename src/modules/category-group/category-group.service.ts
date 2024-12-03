import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoryGroupDto } from './dto/category-group';

@Injectable()
export class CategoryGroupService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryGroupDto: CategoryGroupDto) {
    return await this.prisma.categoryGroup.create({
      data: createCategoryGroupDto,
    });
  }

  findAll() {
    return this.prisma.categoryGroup.findMany({ include: { Category: true } });
  }

  findOne(id: number) {
    return this.prisma.categoryGroup.findUnique({ where: { id } });
  }

  update(id: number, updateCategoryGroupDto: CategoryGroupDto) {
    return this.prisma.categoryGroup.update({
      where: { id },
      data: updateCategoryGroupDto,
    });
  }

  remove(id: number) {
    return this.prisma.categoryGroup.delete({ where: { id } });
  }
}
