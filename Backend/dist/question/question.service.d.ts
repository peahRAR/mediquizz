import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { CreateQuestionDto } from './DTO/create-question.dto';
import { UpdateQuestionDto } from './DTO/update-question.dto';
export declare class QuestionService {
    private readonly questionRepository;
    constructor(questionRepository: Repository<Question>);
    create(createQuestionDto: CreateQuestionDto): Promise<Question>;
    findAll(): Promise<Question[]>;
    findOne(id: number): Promise<Question>;
    update(id: number, updateQuestionDto: UpdateQuestionDto): Promise<Question>;
    remove(id: number): Promise<void>;
}
