import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    update(id: string, user: User): Promise<User>;
    remove(id: string): Promise<void>;
}
