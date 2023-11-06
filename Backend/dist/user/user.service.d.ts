import { Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(user: User): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findOneByUsername(username: string): Promise<User | undefined>;
    update(id: number, user: User): Promise<UpdateResult>;
    remove(id: number): Promise<void>;
}
