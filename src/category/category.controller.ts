import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('tree')
  getTree() {
    return this.categoryService.getTree();
  }

  @Post()
  create(@Body() body: { name: string; parentId?: string }) {
    return this.categoryService.create(body.name, body.parentId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
