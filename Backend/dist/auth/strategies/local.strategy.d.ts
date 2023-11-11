import { AuthService } from '../auth.service';
import { User } from '../../user/user.interface';
declare const LocalStrategy_base: new (...args: any[]) => any;
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(username: string, password: string): Promise<User>;
}
export {};
