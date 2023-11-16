export declare class CreateQuestionDto {
    content: string;
    correctAnswer?: string;
    choices?: string[];
    isMultipleChoice: boolean;
    explanation?: string;
    level: number;
    category: {
        id: number;
    };
}
