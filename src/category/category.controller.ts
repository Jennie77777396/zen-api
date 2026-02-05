import { Controller, Get, Post, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('tree')
  async getTree() {
    try {
      return await this.categoryService.getTree();
    } catch (error) {
      console.error('Error getting category tree:', error);
      throw new HttpException(
        `Failed to get category tree: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() body: { name: string; parentId?: string }) {
    try {
      if (!body.name || !body.name.trim()) {
        throw new HttpException('Category name is required', HttpStatus.BAD_REQUEST);
      }
      return await this.categoryService.create(body.name.trim(), body.parentId);
    } catch (error) {
      console.error('Error creating category:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to create category: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.categoryService.remove(id);
    } catch (error) {
      console.error('Error deleting category:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to delete category: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
