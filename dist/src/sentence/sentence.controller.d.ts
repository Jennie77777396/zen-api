import { SentenceService } from './sentence.service';
export declare class SentenceController {
    private readonly sentenceService;
    constructor(sentenceService: SentenceService);
    findAll(): Promise<({
        category: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        content: string;
        bookName: string | null;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    create(body: {
        content: string;
        categoryId: string;
        bookName?: string;
    }): Promise<{
        category: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        content: string;
        bookName: string | null;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
