import { Category } from '../category/category.entity';
export declare class Question {
    id: number;
    content: string;
    correctAnswer: string;
    choices: string[];
    isMultipleChoice: boolean;
    level: number;
    explanation: string;
    category: Category;
}
