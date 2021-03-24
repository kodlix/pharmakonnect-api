import { Test, TestingModule } from '@nestjs/testing';
import { EventusersService } from './eventusers.service';

describe('EventusersService', () => {
  let service: EventusersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventusersService],
    }).compile();

    service = module.get<EventusersService>(EventusersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
