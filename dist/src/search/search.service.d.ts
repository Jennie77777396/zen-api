import { PrismaService } from '../prisma/prisma.service';
export declare class SearchService {
    private prisma;
    constructor(prisma: PrismaService);
    searchCategories(query: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        parentId: string | null;
    }[]>;
    searchSentences(query: string): Promise<({
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
    searchAll(query: string): Promise<{
        categories: {
            id: string;
            name: string;
            createdAt: Date;
            parentId: string | null;
        }[];
        sentences: ({
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
        })[];
        total: number;
    }>;
}
