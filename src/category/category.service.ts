import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  // 获取无限层级的"金"树
  async getTree() {
    try {
      const categories = await this.prisma.category.findMany();
      return this.listToTree(categories, null);
    } catch (error) {
      console.error('Error in getTree:', error);
      throw new InternalServerErrorException(`Failed to get category tree: ${error.message}`);
    }
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
    try {
      // 如果提供了 parentId，验证父分类是否存在
      if (parentId) {
        const parent = await this.prisma.category.findUnique({
          where: { id: parentId },
        });
        if (!parent) {
          throw new NotFoundException(`Parent category with ID ${parentId} not found`);
        }
      }

      return await this.prisma.category.create({
        data: { name, parentId },
      });
    } catch (error) {
      console.error('Error in create:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to create category: ${error.message}`);
    }
  }

  // 删除分类（未来可用）
  async remove(id: string) {
    try {
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
      if (category.children && category.children.length > 0) {
        throw new InternalServerErrorException(
          `Cannot delete category with ID ${id}: it has ${category.children.length} child categories. Please delete or move children first.`
        );
      }

      // 删除分类（关联的句子不会被删除，只是断开关联）
      await this.prisma.category.delete({
        where: { id },
      });

      return { message: 'Category deleted successfully' };
    } catch (error) {
      console.error('Error in remove:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete category: ${error.message}`);
    }
  }
}
