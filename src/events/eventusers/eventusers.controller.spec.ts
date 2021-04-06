import { Test, TestingModule } from '@nestjs/testing';
import { EventusersController } from './eventusers.controller';
import { EventusersService } from './eventusers.service';

describe('EventusersController', () => {
  let controller: EventusersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventusersController],
      providers: [EventusersService],
    }).compile();

    controller = module.get<EventusersController>(EventusersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
