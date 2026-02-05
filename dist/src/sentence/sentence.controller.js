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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentenceController = void 0;
const common_1 = require("@nestjs/common");
const sentence_service_1 = require("./sentence.service");
let SentenceController = class SentenceController {
    sentenceService;
    constructor(sentenceService) {
        this.sentenceService = sentenceService;
    }
    findAll() {
        return this.sentenceService.findAll();
    }
    create(body) {
        const categoryIds = body.categoryIds || (body.categoryId ? [body.categoryId] : []);
        return this.sentenceService.create(body.content, categoryIds, body.bookName);
    }
    remove(id) {
        return this.sentenceService.remove(id);
    }
};
exports.SentenceController = SentenceController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SentenceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SentenceController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SentenceController.prototype, "remove", null);
exports.SentenceController = SentenceController = __decorate([
    (0, common_1.Controller)('sentences'),
    __metadata("design:paramtypes", [sentence_service_1.SentenceService])
], SentenceController);
//# sourceMappingURL=sentence.controller.js.map