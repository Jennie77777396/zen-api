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
exports.SentenceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SentenceService = class SentenceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        try {
            return await this.prisma.sentence.findMany({
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
        }
        catch (error) {
            console.error('Error in findAll:', error);
            throw new common_1.InternalServerErrorException(`Failed to fetch sentences: ${error.message}`);
        }
    }
    async create(content, categoryIds, bookName) {
        try {
            if (categoryIds.length === 0) {
                throw new common_1.NotFoundException('At least one category is required');
            }
            const categories = await this.prisma.category.findMany({
                where: {
                    id: { in: categoryIds },
                },
            });
            if (categories.length !== categoryIds.length) {
                const foundIds = categories.map(c => c.id);
                const missingIds = categoryIds.filter(id => !foundIds.includes(id));
                throw new common_1.NotFoundException(`Categories with IDs ${missingIds.join(', ')} not found`);
            }
            return await this.prisma.sentence.create({
                data: {
                    content,
                    bookName,
                    categories: {
                        connect: categoryIds.map(id => ({ id })),
                    },
                },
                include: {
                    categories: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
        }
        catch (error) {
            console.error('Error in create:', error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to create sentence: ${error.message}`);
        }
    }
    async remove(id) {
        try {
            const sentence = await this.prisma.sentence.findUnique({
                where: { id },
            });
            if (!sentence) {
                throw new common_1.NotFoundException(`Sentence with ID ${id} not found`);
            }
            await this.prisma.sentence.delete({
                where: { id },
            });
            return { message: 'Sentence deleted successfully' };
        }
        catch (error) {
            console.error('Error in remove:', error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to delete sentence: ${error.message}`);
        }
    }
};
exports.SentenceService = SentenceService;
exports.SentenceService = SentenceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SentenceService);
//# sourceMappingURL=sentence.service.js.map