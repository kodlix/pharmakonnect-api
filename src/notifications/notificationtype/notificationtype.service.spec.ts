import { Test, TestingModule } from '@nestjs/testing';
import { NotificationtypeService } from './notificationtype.service';

describe('NotificationtypeService', () => {
  let service: NotificationtypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationtypeService],
    }).compile();

    service = module.get<NotificationtypeService>(NotificationtypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
