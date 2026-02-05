import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    searchCategories(query: string): Promise<{
        id: string;
        name: string;
        parentId: string | null;
        createdAt: Date;
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
            parentId: string | null;
            createdAt: Date;
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
