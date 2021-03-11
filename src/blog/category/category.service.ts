import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryDto } from './dto/category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(CategoryEntity) private readonly categoryRepo: Repository<CategoryEntity>
  ) { }

  getCount(): Promise<number> {
    return this.categoryRepo.count({});
  }

  public findAll(page = 1, take = 25): Promise<CategoryEntity[]> {
    return this.categoryRepo.find({
      skip: take * (page - 1), take,
      order: {
        id: 'DESC',
      },
      // relations: ['articles'],
    });
  }

  public async findOne(categoryId: string): Promise<CategoryEntity> {
    return await this.categoryRepo.findOneOrFail(categoryId, {
      relations: ['articles'],
    });
  }

  public async create(categoryDto: CategoryDto): Promise<CategoryEntity> {
    const catToCreate: CategoryEntity = { ...categoryDto };
    return await this.categoryRepo.save(catToCreate);
  }

  async update(categoryId: string, categoryDto: CategoryDto): Promise<CategoryEntity> {
    await this.categoryRepo.findOneOrFail(categoryId);
    const catToUpdate: CategoryEntity = {
      ...categoryDto,
    };
    await this.categoryRepo.update(categoryId, catToUpdate);
    return await this.categoryRepo.findOneOrFail(categoryId);
  }

  public async remove(categoryId: string): Promise<CategoryEntity> {
    const category = await this.categoryRepo.findOneOrFail(categoryId);
    return this.categoryRepo.remove(category);
  }

  getOneCategory(categoryId: string): Promise<CategoryEntity> {
    return this.categoryRepo.findOneOrFail(categoryId, {
      relations: ['articles'],
    });
  }

}
