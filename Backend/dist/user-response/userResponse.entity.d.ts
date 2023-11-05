import { User } from '../user/user.entity';
import { Question } from '../question/question.entity';
export declare class UserResponse {
    id: number;
    user: User;
    question: Question;
    givenAnswer: string;
    isCorrect: boolean;
    responseTime: number;
}
