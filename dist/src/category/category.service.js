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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoryService = class CategoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTree() {
        try {
            const categories = await this.prisma.category.findMany();
            return this.listToTree(categories, null);
        }
        catch (error) {
            console.error('Error in getTree:', error);
            throw new common_1.InternalServerErrorException(`Failed to get category tree: ${error.message}`);
        }
    }
    listToTree(list, parentId) {
        return list
            .filter(item => item.parentId === parentId)
            .map(item => ({
            ...item,
            children: this.listToTree(list, item.id),
        }));
    }
    async create(name, parentId) {
        try {
            if (parentId) {
                const parent = await this.prisma.category.findUnique({
                    where: { id: parentId },
                });
                if (!parent) {
                    throw new common_1.NotFoundException(`Parent category with ID ${parentId} not found`);
                }
            }
            return await this.prisma.category.create({
                data: { name, parentId },
            });
        }
        catch (error) {
            console.error('Error in create:', error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to create category: ${error.message}`);
        }
    }
    async remove(id) {
        try {
            const category = await this.prisma.category.findUnique({
                where: { id },
                include: {
                    children: true,
                    sentences: true,
                },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${id} not found`);
            }
            if (category.children && category.children.length > 0) {
                throw new common_1.InternalServerErrorException(`Cannot delete category with ID ${id}: it has ${category.children.length} child categories. Please delete or move children first.`);
            }
            await this.prisma.category.delete({
                where: { id },
            });
            return { message: 'Category deleted successfully' };
        }
        catch (error) {
            console.error('Error in remove:', error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to delete category: ${error.message}`);
        }
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoryService);
//# sourceMappingURL=category.service.js.map