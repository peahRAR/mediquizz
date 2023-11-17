import { Test, TestingModule } from '@nestjs/testing';
import { QuizGateway } from './quiz.gateway';

describe('QuizzGateway', () => {
  let gateway: QuizGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizGateway],
    }).compile();

    gateway = module.get<QuizGateway>(QuizGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
