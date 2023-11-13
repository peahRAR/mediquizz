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
exports.QuestionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const question_entity_1 = require("./question.entity");
let QuestionService = class QuestionService {
    constructor(questionRepository) {
        this.questionRepository = questionRepository;
    }
    async create(createQuestionDto) {
        const question = this.questionRepository.create(createQuestionDto);
        return this.questionRepository.save(question);
    }
    async findAll() {
        return this.questionRepository.find();
    }
    async findOne(id) {
        const question = await this.questionRepository.findOne({
            where: { id: id },
        });
        if (!question) {
            throw new common_1.NotFoundException(`Question with ID ${id} not found`);
        }
        return question;
    }
    async update(id, updateQuestionDto) {
        const question = await this.findOne(id);
        Object.assign(question, updateQuestionDto);
        return this.questionRepository.save(question);
    }
    async remove(id) {
        const question = await this.findOne(id);
        await this.questionRepository.remove(question);
    }
};
exports.QuestionService = QuestionService;
exports.QuestionService = QuestionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], QuestionService);
//# sourceMappingURL=question.service.js.map