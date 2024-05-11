import { Test, TestingModule } from '@nestjs/testing';
import { ListItemsController } from './list-items.controller';

describe('ListItemsController', () => {
  let controller: ListItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListItemsController],
    }).compile();

    controller = module.get<ListItemsController>(ListItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
