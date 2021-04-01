import { Test, TestingModule } from '@nestjs/testing';
import { EventtypeController } from './eventtype.controller';
import { EventtypeService } from './eventtype.service';

describe('EventtypeController', () => {
  let controller: EventtypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventtypeController],
      providers: [EventtypeService],
    }).compile();

    controller = module.get<EventtypeController>(EventtypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
