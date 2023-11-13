import { QuestionService } from './question.service';
import { CreateQuestionDto } from './DTO/create-question.dto';
import { UpdateQuestionDto } from './DTO/update-question.dto';
export declare class QuestionController {
    private readonly questionService;
    constructor(questionService: QuestionService);
    create(createQuestionDto: CreateQuestionDto): Promise<import("./question.entity").Question>;
    findAll(): Promise<import("./question.entity").Question[]>;
    findOne(id: number): Promise<import("./question.entity").Question>;
    update(id: number, updateQuestionDto: UpdateQuestionDto): Promise<import("./question.entity").Question>;
    remove(id: number): Promise<void>;
}
