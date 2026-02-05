import { PrismaService } from '../prisma/prisma.service';
export declare class SentenceService {
    private prisma;
    constructor(prisma: PrismaService);
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
    create(content: string, categoryIds: string[], bookName?: string): Promise<{
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
