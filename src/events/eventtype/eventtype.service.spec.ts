import { Test, TestingModule } from '@nestjs/testing';
import { EventtypeService } from './eventtype.service';

describe('EventtypeService', () => {
  let service: EventtypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventtypeService],
    }).compile();

    service = module.get<EventtypeService>(EventtypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
