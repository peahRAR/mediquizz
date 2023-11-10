import { Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './create-user.dto';
export declare class UserService {
    private readonly userRepository;
    private readonly configService;
    private readonly salt;
    constructor(userRepository: Repository<User>, configService: ConfigService);
    private createMailIdentifier;
    private createMailData;
    create(userData: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    verifyPassword(username: string, password: string): Promise<User | null>;
    findOneByUsername(username: string): Promise<User | undefined>;
    update(id: number, user: User): Promise<UpdateResult>;
    remove(id: number): Promise<void>;
}
