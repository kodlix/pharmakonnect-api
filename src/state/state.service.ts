import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterDto } from 'src/_common/filter.dto';
import { Repository } from 'typeorm';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { StateEntity } from './entities/state.entity';
import { StateRO } from './state.interface';

@Injectable()
export class StateService {

  constructor(
    @InjectRepository(StateEntity)
    private readonly stateRepository: Repository<StateEntity>
  ) { }

  public async findAll({ search }: FilterDto): Promise<StateRO[]> {
    const query = this.stateRepository.createQueryBuilder('state');
    if (search) {
      query.andWhere('(state.code LIKE :search OR state.name LIKE :search OR state.capital LIKE :search)',
        { search: `%${search}%` });
    }
    const result = await query.getMany();
    return this.buildArrRO(result);
  }

  public async findOne(id: string): Promise<StateRO> {
    const result = await this.stateRepository.findOne(id);
    if (!result) {
      throw new HttpException({
        error: `state with id ${id} does not exists`, status: HttpStatus.NOT_FOUND
      }, HttpStatus.NOT_FOUND);
    }
    return this.buildRO(result);
  }

  public async findByCountry(countryId: string): Promise<StateRO> {
    const result = await this.stateRepository.findOne({ where: { countryId: countryId } });
    if (!result) {
      throw new HttpException({
        error: `country with id ${countryId} does not exists`, status: HttpStatus.NOT_FOUND
      }, HttpStatus.NOT_FOUND);
    }
    return this.buildRO(result);
  }

  public async create(toCreate: CreateStateDto): Promise<string> {
    const { code, name } = toCreate;
    const isExists = await await this.stateRepository.findOne({ code });
    if (isExists) {
      throw new HttpException({ error: `${code} already exists`, status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST);
    }
    const country = new StateEntity();
    country.code = code;
    country.name = name;
    try {
      await country.save();
      return 'State successfully created';;
    } catch (error) {
      throw new HttpException({ error: `An error occured`, status: HttpStatus.INTERNAL_SERVER_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async update(id: string, toUpdate: UpdateStateDto): Promise<StateRO> {
    const country = await this.stateRepository.findOne(id);
    if (!country) {
      throw new HttpException({
        error: `state with id ${id} does not exists`, status: HttpStatus.NOT_FOUND
      }, HttpStatus.NOT_FOUND);
    }
    const result = await this.stateRepository.merge(country, toUpdate);
    await this.stateRepository.save(country);
    return this.buildRO(result);
  }

  public async remove(id: string): Promise<void> {
    const result = await this.stateRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException({
        error: `state with id ${id} does not exists`, status: HttpStatus.NOT_FOUND
      }, HttpStatus.NOT_FOUND);
    }
  }

  public find() {
    return this.stateRepository.find();
  }

  public addRange(states: StateEntity[]) {
    try {
      if (states.length > 0) {
        this.stateRepository.save(states);
      }
    } catch (error) {
      console.log(error);
    }
  }

  private buildRO(data: StateEntity) {
    const state = {
      id: data.id,
      code: data.code,
      name: data.name,
      countryId: data.countryId
    };
    return state;
  }

  public buildArrRO(data: StateEntity[]) {
    let dataArr = [];
    data.forEach(item => {
      dataArr.push(this.buildRO(item));
    })
    return dataArr;
  }

}
