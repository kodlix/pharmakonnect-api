import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleMeetingsController } from './schedule-meetings.controller';
import { ScheduleMeetingsService } from './schedule-meetings.service';

describe('ScheduleMeetingsController', () => {
  let controller: ScheduleMeetingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleMeetingsController],
      providers: [ScheduleMeetingsService],
    }).compile();

    controller = module.get<ScheduleMeetingsController>(ScheduleMeetingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
