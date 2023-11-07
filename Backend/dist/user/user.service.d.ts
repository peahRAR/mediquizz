import { Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';
export declare class UserService {
    private readonly userRepository;
    private readonly configService;
    private readonly salt;
    constructor(userRepository: Repository<User>, configService: ConfigService);
    create(user: User): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    verifyPassword(username: string, password: string): Promise<User | null>;
    findOneByUsername(username: string): Promise<User | undefined>;
    decryptEmail(user: User): Promise<string>;
    update(id: number, user: User): Promise<UpdateResult>;
    remove(id: number): Promise<void>;
}
