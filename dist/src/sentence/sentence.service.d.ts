import { PrismaService } from '../prisma/prisma.service';
export declare class SentenceService {
    private prisma;
    constructor(prisma: PrismaService);
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
    create(content: string, categoryId: string, bookName?: string): Promise<{
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
