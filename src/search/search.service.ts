import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  /**
   * 搜索分类（按名称）
   * @param query 搜索关键词
   * @returns 匹配的分类列表（扁平化，不包含树结构）
   */
  async searchCategories(query: string) {
    if (!query || !query.trim()) {
      return [];
    }

    const searchTerm = query.trim().toLowerCase();

    const categories = await this.prisma.category.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive', // PostgreSQL case-insensitive search
        },
      },
      select: {
        id: true,
        name: true,
        parentId: true,
        createdAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories;
  }

  /**
   * 搜索句子（按内容和分类）
   * @param query 搜索关键词
   * @returns 匹配的句子列表（包含关联的分类）
   */
  async searchSentences(query: string) {
    if (!query || !query.trim()) {
      return [];
    }

    const searchTerm = query.trim().toLowerCase();

    // 搜索句子内容和分类名称
    const sentences = await this.prisma.sentence.findMany({
      where: {
        OR: [
          {
            content: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            bookName: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            categories: {
              some: {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            },
          },
        ],
      },
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

    return sentences;
  }

  /**
   * 综合搜索（分类和句子）
   * @param query 搜索关键词
   * @returns 包含分类和句子的搜索结果
   */
  async searchAll(query: string) {
    const [categories, sentences] = await Promise.all([
      this.searchCategories(query),
      this.searchSentences(query),
    ]);

    return {
      categories,
      sentences,
      total: categories.length + sentences.length,
    };
  }
}
