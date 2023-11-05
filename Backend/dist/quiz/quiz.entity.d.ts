import { Category } from '../category/category.entity';
export declare class Quiz {
    id: number;
    title: string;
    timer: number;
    numberOfQuestions: number;
    selectedCategories: Category[];
    maxParticipants: number;
}
