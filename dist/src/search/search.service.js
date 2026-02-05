"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SearchService = class SearchService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchCategories(query) {
        if (!query || !query.trim()) {
            return [];
        }
        const searchTerm = query.trim().toLowerCase();
        const categories = await this.prisma.category.findMany({
            where: {
                name: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            },
            select: {
                id: true,
                name: true,
                parentId: true,
                createdAt: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return categories;
    }
    async searchSentences(query) {
        if (!query || !query.trim()) {
            return [];
        }
        const searchTerm = query.trim().toLowerCase();
        const sentences = await this.prisma.sentence.findMany({
            where: {
                OR: [
                    {
                        content: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                    {
                        bookName: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                    {
                        categories: {
                            some: {
                                name: {
                                    contains: searchTerm,
                                    mode: 'insensitive',
                                },
                            },
                        },
                    },
                ],
            },
            include: {
                categories: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return sentences;
    }
    async searchAll(query) {
        const [categories, sentences] = await Promise.all([
            this.searchCategories(query),
            this.searchSentences(query),
        ]);
        return {
            categories,
            sentences,
            total: categories.length + sentences.length,
        };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map