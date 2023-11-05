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
exports.UserResponse = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
const question_entity_1 = require("../question/question.entity");
let UserResponse = class UserResponse {
};
exports.UserResponse = UserResponse;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserResponse.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], UserResponse.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => question_entity_1.Question),
    __metadata("design:type", question_entity_1.Question)
], UserResponse.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserResponse.prototype, "givenAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], UserResponse.prototype, "isCorrect", void 0);
__decorate([
    (0, typeorm_1.Column)('double precision'),
    __metadata("design:type", Number)
], UserResponse.prototype, "responseTime", void 0);
exports.UserResponse = UserResponse = __decorate([
    (0, typeorm_1.Entity)()
], UserResponse);
//# sourceMappingURL=userResponse.entity.js.map