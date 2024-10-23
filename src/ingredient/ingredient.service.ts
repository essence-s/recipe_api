import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class IngredientService {
  constructor(private prisma: PrismaService) {}

  async createIngredient(ingredients) {
    // return this.prisma.ingredient.create({
    //   data: ingredient,
    // });
    // return this.prisma.ingredient.createMany({
    //   data: ingredients,
    //   // skipDuplicates: true,
    // });
  }

  async findAll() {
    // return this.prisma.ingredient.findMany();
  }
}
