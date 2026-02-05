"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentenceModule = void 0;
const common_1 = require("@nestjs/common");
const sentence_controller_1 = require("./sentence.controller");
const sentence_service_1 = require("./sentence.service");
const prisma_module_1 = require("../prisma/prisma.module");
let SentenceModule = class SentenceModule {
};
exports.SentenceModule = SentenceModule;
exports.SentenceModule = SentenceModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [sentence_controller_1.SentenceController],
        providers: [sentence_service_1.SentenceService],
    })
], SentenceModule);
//# sourceMappingURL=sentence.module.js.map