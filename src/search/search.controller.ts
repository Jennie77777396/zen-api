import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('categories')
  async searchCategories(@Query('q') query: string) {
    try {
      if (!query || !query.trim()) {
        return [];
      }
      return await this.searchService.searchCategories(query);
    } catch (error) {
      console.error('Error searching categories:', error);
      throw new HttpException(
        `Failed to search categories: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('sentences')
  async searchSentences(@Query('q') query: string) {
    try {
      if (!query || !query.trim()) {
        return [];
      }
      return await this.searchService.searchSentences(query);
    } catch (error) {
      console.error('Error searching sentences:', error);
      throw new HttpException(
        `Failed to search sentences: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async searchAll(@Query('q') query: string) {
    try {
      if (!query || !query.trim()) {
        return {
          categories: [],
          sentences: [],
          total: 0,
        };
      }
      return await this.searchService.searchAll(query);
    } catch (error) {
      console.error('Error searching:', error);
      throw new HttpException(
        `Failed to search: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
