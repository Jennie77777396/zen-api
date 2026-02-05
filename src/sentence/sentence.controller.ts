import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { SentenceService } from './sentence.service';

@Controller('sentences')
export class SentenceController {
  constructor(private readonly sentenceService: SentenceService) {}

  @Get()
  findAll() {
    return this.sentenceService.findAll();
  }

  @Post()
  create(@Body() body: { content: string; categoryIds: string[]; bookName?: string }) {
    // 兼容旧格式：如果传入 categoryId，转换为数组
    const categoryIds = body.categoryIds || (body.categoryId ? [body.categoryId] : []);
    return this.sentenceService.create(body.content, categoryIds, body.bookName);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sentenceService.remove(id);
  }
}
