import { Injectable } from '@nestjs/common';
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
    return this.prisma.category.create({
      data: { name, parentId },
    });
  }
}
