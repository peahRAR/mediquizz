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
    createMailIdentifier(email) {
        const secretKey = this.configService.get('PASSWORDMAIL');
        return crypto.createHmac('sha256', secretKey).update(email).digest('hex');
    }
    createMailData(email) {
        const secret = this.configService.get('ENCRYPTION_KEY');
        if (!secret) {
            throw new Error('Secret key is not defined in the configuration.');
        }
        const key = crypto.scryptSync(secret, 'salt', 32);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(email, 'utf-8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    }
    async create(userData) {
        const mailIdentifier = this.createMailIdentifier(userData.email);
        const checkEmail = await this.userRepository
            .createQueryBuilder('user')
            .where("user.email ->> 'mailIdentifier' = :mailIdentifier", {
            mailIdentifier,
        })
            .getOne();
        if (checkEmail) {
            throw new common_1.ConflictException('Un utilisateur avec cet e-mail existe déjà.');
        }
        const existingUser = await this.findOneByUsername(userData.username);
        if (existingUser) {
            throw new common_1.ConflictException("Nom d'utilisateur déjà utilisé");
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = this.userRepository.create({
            username: userData.username,
            password: hashedPassword,
            email: {
                mailIdentifier: mailIdentifier,
                mailData: this.createMailData(userData.email),
            },
            bestScore: 0,
            privilegeLevel: 0,
        });
        return this.userRepository.save(newUser);
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