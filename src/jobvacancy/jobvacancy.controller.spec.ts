/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { JobVacancyController } from './jobvacancy.controller';
import { JobVacancyService } from './jobvacancy.service';

describe('JobVacancyController', () => {
  let controller: JobVacancyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobVacancyController],
      providers: [JobVacancyService],
    }).compile();

    controller = module.get<JobVacancyController>(JobVacancyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
