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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
let UserService = class UserService {
    constructor(userRepository, configService) {
        this.userRepository = userRepository;
        this.configService = configService;
        this.salt = this.configService.get('SALT');
    }
    async create(user) {
        const checkEmail = await this.userRepository.findOne({
            where: { email: user.email },
        });
        if (checkEmail) {
            throw new common_1.ConflictException('Un utilisateur avec cet e-mail existe déjà.');
        }
        const existingUser = await this.findOneByUsername(user.username);
        if (existingUser) {
            throw new common_1.ConflictException("Nom d'utilisateur déjà utilisé");
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;
        const email = user.email;
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.salt), iv);
        let encryptedEmail = cipher.update(email, 'utf8', 'hex');
        encryptedEmail += cipher.final('hex');
        user.email = `${iv.toString('hex')}:${encryptedEmail}`;
        return this.userRepository.save(user);
    }
    async findAll() {
        return this.userRepository.find();
    }
    async findOne(id) {
        const options = {
            where: { id },
        };
        return this.userRepository.findOne(options);
    }
    async verifyPassword(username, password) {
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }
    async findOneByUsername(username) {
        return this.userRepository.findOne({ where: { username } });
    }
    async decryptEmail(user) {
        const [iv, encryptedEmail] = user.email.split(':');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.salt), Buffer.from(iv, 'hex'));
        let decryptedEmail = decipher.update(encryptedEmail, 'hex', 'utf8');
        decryptedEmail += decipher.final('utf8');
        return decryptedEmail;
    }
    async update(id, user) {
        return this.userRepository.update(id, user);
    }
    async remove(id) {
        this.userRepository.delete(id);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map