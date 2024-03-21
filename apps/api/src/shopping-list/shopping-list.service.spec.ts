import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingListService } from './shopping-list.service';

describe('ShoppingListService', () => {
  let service: ShoppingListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShoppingListService],
    }).compile();

    service = module.get<ShoppingListService>(ShoppingListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
