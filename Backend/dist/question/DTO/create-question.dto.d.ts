export declare class CreateQuestionDto {
    content: string;
    correctAnswer?: string;
    choices?: string[];
    isMultipleChoice: boolean;
    level: number;
}
