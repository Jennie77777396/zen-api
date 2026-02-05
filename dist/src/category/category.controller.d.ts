import { CategoryService } from './category.service';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    getTree(): Promise<any[]>;
    create(body: {
        name: string;
        parentId?: string;
    }): Promise<{
        id: string;
        name: string;
        parentId: string | null;
        createdAt: Date;
    }>;
}
