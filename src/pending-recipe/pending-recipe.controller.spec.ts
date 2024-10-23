import { Test, TestingModule } from '@nestjs/testing';
import { PendingRecipeController } from './pending-recipe.controller';

describe('PendingRecipeController', () => {
  let controller: PendingRecipeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PendingRecipeController],
    }).compile();

    controller = module.get<PendingRecipeController>(PendingRecipeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
