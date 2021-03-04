import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleMeetingsService } from './schedule-meetings.service';

describe('ScheduleMeetingsService', () => {
  let service: ScheduleMeetingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleMeetingsService],
    }).compile();

    service = module.get<ScheduleMeetingsService>(ScheduleMeetingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
