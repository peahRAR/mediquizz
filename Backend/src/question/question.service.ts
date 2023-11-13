import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { CreateQuestionDto } from './DTO/create-question.dto';
import { UpdateQuestionDto } from './DTO/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  // Créer une nouvelle question
  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const question = this.questionRepository.create(createQuestionDto);
    return this.questionRepository.save(question);
  }

  // Trouver toutes les questions
  async findAll(): Promise<Question[]> {
    return this.questionRepository.find();
  }

  // Trouver une question par ID
  async findOne(id: number): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id: id },
    });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  // Mettre à jour une question
  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const question = await this.findOne(id);
    Object.assign(question, updateQuestionDto);
    return this.questionRepository.save(question);
  }

  // Supprimer une question
  async remove(id: number): Promise<void> {
    const question = await this.findOne(id);
    await this.questionRepository.remove(question);
  }
}
