import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    try {
      return await this.prisma.contact.create({
        data: createContactDto,
      });
    } catch (error) {
      throw new BadRequestException('Error creating contact');
    }
  }

  async findAll() {
    return await this.prisma.contact.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.contact.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    return await this.prisma.contact.update({
      where: { id },
      data: updateContactDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.contact.delete({
      where: { id },
    });
  }
}
