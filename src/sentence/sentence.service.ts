import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SentenceService {
  constructor(private prisma: PrismaService) {}

  // 获取所有句子，包含关联的分类信息
  async findAll() {
    return this.prisma.sentence.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // 创建新句子
  async create(content: string, categoryId: string, bookName?: string) {
    // 验证分类是否存在
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return this.prisma.sentence.create({
      data: {
        content,
        categoryId,
        bookName,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  // 删除句子
  async remove(id: string) {
    const sentence = await this.prisma.sentence.findUnique({
      where: { id },
    });

    if (!sentence) {
      throw new NotFoundException(`Sentence with ID ${id} not found`);
    }

    await this.prisma.sentence.delete({
      where: { id },
    });

    return { message: 'Sentence deleted successfully' };
  }
}
