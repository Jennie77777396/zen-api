import { SentenceService } from './sentence.service';
export declare class SentenceController {
    private readonly sentenceService;
    constructor(sentenceService: SentenceService);
    findAll(): Promise<({
        categories: {
            id: string;
            name: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        content: string;
        bookName: string | null;
        updatedAt: Date;
    })[]>;
    create(body: {
        content: string;
        categoryIds?: string[];
        categoryId?: string;
        bookName?: string;
    }): Promise<{
        categories: {
            id: string;
            name: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        content: string;
        bookName: string | null;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
