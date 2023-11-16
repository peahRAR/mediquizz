import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './DTO/create-question.dto';
import { UpdateQuestionDto } from './DTO/update-question.dto';
import { Public } from 'src/decorators/public.decorator';
import { Question } from './question.entity';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Public()
  @Post()
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Public()
  @Get()
  async findAll(): Promise<Question[]> {
    const questions = await this.questionService.findAll();
    return questions;
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Question> {
    const question = await this.questionService.findOne(Number(id));
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  @Public()
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.update(id, updateQuestionDto);
  }

  @Public()
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.questionService.remove(id);
  }
}
