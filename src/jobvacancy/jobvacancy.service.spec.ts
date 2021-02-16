import { Test, TestingModule } from '@nestjs/testing';
import { JobVacancyService } from './jobvacancy.service';

describe('JobVacancyService', () => {
  let service: JobVacancyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobVacancyService],
    }).compile();

    service = module.get<JobVacancyService>(JobVacancyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
