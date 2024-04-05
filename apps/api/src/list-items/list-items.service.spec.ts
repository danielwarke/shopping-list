import { Test, TestingModule } from '@nestjs/testing';
import { ListItemsService } from './list-items.service';

describe('ListItemsService', () => {
  let service: ListItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListItemsService],
    }).compile();

    service = module.get<ListItemsService>(ListItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
