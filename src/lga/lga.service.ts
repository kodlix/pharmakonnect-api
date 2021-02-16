import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterDto } from 'src/_common/filter.dto';
import { Repository } from 'typeorm';
import { CreateLgaDto } from './dto/create-lga.dto';
import { UpdateLgaDto } from './dto/update-lga.dto';
import { LgaEntity } from './entities/lga.entity';
import { LgaRO } from './lga.interface';

@Injectable()
export class LgaService {

  constructor(
    @InjectRepository(LgaEntity)
    private readonly lgaRepository: Repository<LgaEntity>
  ) { }

  public async findAll({ search }: FilterDto): Promise<LgaRO[]> {
    const query = this.lgaRepository.createQueryBuilder('lga');
    if (search) {
      query.andWhere('(lga.code LIKE :search OR lga.name LIKE :search)', { search: `%${search}%` });
    }
    const result = await query.getMany();
    return this.buildArrRO(result);
  }

  public async findOne(id: string): Promise<LgaRO> {
    const result = await this.lgaRepository.findOne(id);
    if (!result) {
      throw new HttpException({
        error: `lga with id ${id} does not exists`, status: HttpStatus.NOT_FOUND
      }, HttpStatus.NOT_FOUND);
    }
    return this.buildRO(result);
  }

  public async findByState(stateId: string): Promise<LgaRO> {
    const result = await this.lgaRepository.findOne({ where: { stateId: stateId } });
    if (!result) {
      throw new HttpException({
        error: `country with id ${stateId} does not exists`, status: HttpStatus.NOT_FOUND
      }, HttpStatus.NOT_FOUND);
    }
    return this.buildRO(result);
  }

  public async create(toCreate: CreateLgaDto): Promise<string> {
    const { code, name, createdBy } = toCreate;
    const isExists = await await this.lgaRepository.findOne({ code });
    if (isExists) {
      throw new HttpException({ error: `${code} already exists`, status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST);
    }
    const country = new LgaEntity();
    country.code = code;
    country.name = name;
    country.createdBy = createdBy;
    try {
      await country.save();
      return 'Lga successfully created';;
    } catch (error) {
      throw new HttpException({ error: `An error occured`, status: HttpStatus.INTERNAL_SERVER_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async update(id: string, toUpdate: UpdateLgaDto): Promise<LgaRO> {
    const country = await this.lgaRepository.findOne(id);
    if (!country) {
      throw new HttpException({
        error: `lga with id ${id} does not exists`, status: HttpStatus.NOT_FOUND
      }, HttpStatus.NOT_FOUND);
    }
    const result = await this.lgaRepository.merge(country, toUpdate);
    await this.lgaRepository.save(country);
    return this.buildRO(result);
  }

  public async remove(id: string): Promise<void> {
    const result = await this.lgaRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException({
        error: `lga with id ${id} does not exists`, status: HttpStatus.NOT_FOUND
      }, HttpStatus.NOT_FOUND);
    }
  }

  private buildRO(data: LgaEntity) {
    const lga = {
      id: data.id,
      code: data.code,
      name: data.name,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      stateId: data.stateId
    };
    return lga;
  }
  public buildArrRO(data: LgaEntity[]) {
    let dataArr = [];
    data.forEach(item => {
      dataArr.push(this.buildRO(item));
    })
    return dataArr;
  }


}
