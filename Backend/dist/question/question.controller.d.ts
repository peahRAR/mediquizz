import { QuestionService } from './question.service';
import { CreateQuestionDto } from './DTO/create-question.dto';
import { UpdateQuestionDto } from './DTO/update-question.dto';
import { Question } from './question.entity';
export declare class QuestionController {
    private readonly questionService;
    constructor(questionService: QuestionService);
    create(createQuestionDto: CreateQuestionDto): Promise<Question>;
    findAll(): Promise<Question[]>;
    findOne(id: string): Promise<Question>;
    update(id: number, updateQuestionDto: UpdateQuestionDto): Promise<Question>;
    remove(id: number): Promise<void>;
}
