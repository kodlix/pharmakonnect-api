import { Test, TestingModule } from '@nestjs/testing';
import { NotificationtypeController } from './notificationtype.controller';
import { NotificationtypeService } from './notificationtype.service';

describe('NotificationtypeController', () => {
  let controller: NotificationtypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationtypeController],
      providers: [NotificationtypeService],
    }).compile();

    controller = module.get<NotificationtypeController>(NotificationtypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
