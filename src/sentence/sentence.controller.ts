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
  create(@Body() body: { content: string; categoryId: string; bookName?: string }) {
    return this.sentenceService.create(body.content, body.categoryId, body.bookName);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sentenceService.remove(id);
  }
}
