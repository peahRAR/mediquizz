import { Test, TestingModule } from '@nestjs/testing';
import { UserResponseController } from './user-response.controller';

describe('UserResponseController', () => {
  let controller: UserResponseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserResponseController],
    }).compile();

    controller = module.get<UserResponseController>(UserResponseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
