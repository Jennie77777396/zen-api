import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  // 获取无限层级的"金"树
  async getTree() {
    const categories = await this.prisma.category.findMany();
    return this.listToTree(categories, null);
  }

  // 核心算法：递归映射
  private listToTree(list: any[], parentId: string | null): any[] {
    return list
      .filter(item => item.parentId === parentId)
      .map(item => ({
        ...item,
        children: this.listToTree(list, item.id),
      }));
  }

  async create(name: string, parentId?: string) {
    // 如果提供了 parentId，验证父分类是否存在
    if (parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: parentId },
      });
      if (!parent) {
        throw new NotFoundException(`Parent category with ID ${parentId} not found`);
      }
    }

    return this.prisma.category.create({
      data: { name, parentId },
    });
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        sentences: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // 检查是否有子分类
    if (category.children.length > 0) {
      throw new Error('Cannot delete category with child categories. Please delete child categories first.');
    }

    // 检查是否有关联的句子
    if (category.sentences.length > 0) {
      throw new Error('Cannot delete category with associated sentences. Please delete or move sentences first.');
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  }
}
