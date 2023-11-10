export declare class User {
    id: number;
    username: string;
    email: {
        mailIdentifier: string;
        mailData: string;
    };
    password: string;
    bestScore: number;
    privilegeLevel: number;
}
