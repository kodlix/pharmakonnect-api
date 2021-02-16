import { Test, TestingModule } from '@nestjs/testing';
import { LgaController } from './lga.controller';
import { LgaService } from './lga.service';

describe('LgaController', () => {
  let controller: LgaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LgaController],
      providers: [LgaService],
    }).compile();

    controller = module.get<LgaController>(LgaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
