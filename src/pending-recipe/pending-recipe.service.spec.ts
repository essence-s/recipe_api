import { Test, TestingModule } from '@nestjs/testing';
import { PendingRecipeService } from './pending-recipe.service';

describe('PendingRecipeService', () => {
  let service: PendingRecipeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingRecipeService],
    }).compile();

    service = module.get<PendingRecipeService>(PendingRecipeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
