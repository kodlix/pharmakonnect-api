import { CountryRO } from './country.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCountryDto } from './dto/create-country.dto';
import { CountryEntity } from './entities/country.entity';
import { UpdateCountryDto } from './dto/update-country.dto';
import { FilterDto } from 'src/_common/filter.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>
  ) { }

  public async findAll({ search }: FilterDto): Promise<CountryRO[]> {
    const query = this.countryRepository.createQueryBuilder('country');
    if (search) {
      query.andWhere('(country.code LIKE :search OR country.name LIKE :search OR country.capital LIKE :search)',
       { search: `%${search}%` });
    }
    const result = await query.getMany();
    return this.buildArrRO(result);
  }

  public async findOne(id: string): Promise<CountryRO> {
    const result = await this.countryRepository.findOne(id);
    if (!result) {
      throw new HttpException({
        error: `country with id ${id} does not exists`, status: HttpStatus.NOT_FOUND
      }, HttpStatus.NOT_FOUND);
    }
    return this.buildRO(result);
  }

  public async create(toCreate: CreateCountryDto): Promise<string> {
    const { code, name, capital, createdBy } = toCreate;
    const isExists = await await this.countryRepository.findOne({ code });
    if (isExists) {
      throw new HttpException({ error: `${code} already exists`, status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST);
    }
    const country = new CountryEntity();
    country.code = code;
    country.name = name;
    country.capital = capital;
    country.createdBy = createdBy;
    try {
      await country.save();
      return 'Country successfully created';;
    } catch (error) {
      throw new HttpException({ error: `An error occured`, status: HttpStatus.INTERNAL_SERVER_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async update(id: string, toUpdate: UpdateCountryDto): Promise<CountryRO> {
    const country = await this.countryRepository.findOne(id);
    if (!country) {
      throw new HttpException({
        error: `country with id ${id} does not exists`, status: HttpStatus.NOT_FOUND
      }, HttpStatus.NOT_FOUND);
    }

    const result = await this.countryRepository.merge(country, toUpdate);
    await this.countryRepository.save(country);
    return this.buildRO(result);
  }

  public async remove(id: string): Promise<void> {
    const result = await this.countryRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException({
        error: `country with id ${id} does not exists`, status: HttpStatus.NOT_FOUND
      }, HttpStatus.NOT_FOUND);
    }
  }

  private buildRO(data: CountryEntity) {
    const country = {
      id: data.id,
      code: data.code,
      name: data.name,
      capital: data.capital,
      createdBy: data.createdBy,
      createdAt: data.createdAt
    };
    return country;
  }

  public buildArrRO(data: CountryEntity[]) {
    let dataArr = [];
    data.forEach(item => {
      dataArr.push(this.buildRO(item));
    })
    return dataArr;
  }

}
