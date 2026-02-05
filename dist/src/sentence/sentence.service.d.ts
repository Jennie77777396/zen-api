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
        createdAt: Date;
        content: string;
        bookName: string | null;
        categoryId: string;
        updatedAt: Date;
    })[]>;
    create(content: string, categoryId: string, bookName?: string): Promise<{
        category: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        bookName: string | null;
        categoryId: string;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
