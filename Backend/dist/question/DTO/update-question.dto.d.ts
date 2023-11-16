export declare class UpdateQuestionDto {
    content?: string;
    correctAnswer?: string;
    choices?: string[];
    isMultipleChoice?: boolean;
    explanation?: string;
    level: number;
    category: {
        id: number;
    };
}
