import { PrismaService } from '../prisma/prisma.service';
export declare class CategoryService {
    private prisma;
    constructor(prisma: PrismaService);
    getTree(): Promise<any[]>;
    private listToTree;
    create(name: string, parentId?: string): Promise<{
        id: string;
        name: string;
        parentId: string | null;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
