import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { SectorEntity } from './entities/sector.entity';
import { SectorRO } from './sector.interface';

@Injectable()
export class SectorService {
  constructor(
    @InjectRepository(SectorEntity)
    private readonly sectorRepository: Repository<SectorEntity>
  ) { }

  async create(dto: CreateSectorDto): Promise<SectorRO> {
    let existingSector = await this.sectorRepository.findOne({ name: dto.name });
    console.log('existingSector', existingSector);
    
    if (existingSector) {
      throw new HttpException({ message: `sector with name '${dto.name}' already exists` }, HttpStatus.BAD_REQUEST);
    }

    let { name, description, createdBy } = dto;

    let sector = new SectorEntity();
    sector.name = name;
    sector.description = description;
    sector.createdBy = createdBy;

    console.log(sector);

    let result = await this.sectorRepository.save(sector);
    console.log("result", result);

    return result;
  }

  async findAll(): Promise<SectorRO[]> {
    return await this.sectorRepository.find();
  }

  async findOne(id: string): Promise<SectorRO> {
    let sector = await this.sectorRepository.findOne(id);
    if (!sector) {
      throw new HttpException({ message: 'sector not found' }, HttpStatus.NOT_FOUND);
    }
    return sector;
  }

  async update(id: string, updateSectorDto: UpdateSectorDto): Promise<SectorEntity> {
    const sector = await this.sectorRepository.findOne(id);

    let updatedSector = Object.assign(sector, updateSectorDto);
    return await this.sectorRepository.save(updatedSector);
  }

  async remove(id: string): Promise<DeleteResult> {
    let sectorToDelete = await this.sectorRepository.findOne(id);
    return await this.sectorRepository.delete(sectorToDelete);
  }
}
