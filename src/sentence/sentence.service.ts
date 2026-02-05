import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SentenceService {
  constructor(private prisma: PrismaService) {}

  // 获取所有句子，包含关联的分类信息（多分类）
  async findAll() {
    try {
      return await this.prisma.sentence.findMany({
        include: {
          categories: {
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
    } catch (error) {
      console.error('Error in findAll:', error);
      throw new InternalServerErrorException(`Failed to fetch sentences: ${error.message}`);
    }
  }

  // 创建新句子（支持多分类）
  async create(content: string, categoryIds: string[], bookName?: string) {
    try {
      // 验证所有分类是否存在
      if (categoryIds.length === 0) {
        throw new NotFoundException('At least one category is required');
      }

      const categories = await this.prisma.category.findMany({
        where: {
          id: { in: categoryIds },
        },
      });

      if (categories.length !== categoryIds.length) {
        const foundIds = categories.map(c => c.id);
        const missingIds = categoryIds.filter(id => !foundIds.includes(id));
        throw new NotFoundException(`Categories with IDs ${missingIds.join(', ')} not found`);
      }

      return await this.prisma.sentence.create({
        data: {
          content,
          bookName,
          categories: {
            connect: categoryIds.map(id => ({ id })),
          },
        },
        include: {
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error in create:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to create sentence: ${error.message}`);
    }
  }

  // 删除句子
  async remove(id: string) {
    try {
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
    } catch (error) {
      console.error('Error in remove:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete sentence: ${error.message}`);
    }
  }
}
