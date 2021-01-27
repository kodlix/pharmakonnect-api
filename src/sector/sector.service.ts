import { Injectable } from '@nestjs/common';
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

  async create(createSectorDto: CreateSectorDto): Promise<SectorRO> {
    return await this.sectorRepository.create(createSectorDto);
  }

  async findAll(): Promise<SectorRO[]> {
    return await this.sectorRepository.find();
  }

  async findOne(id: string) {
    return await this.sectorRepository.findByIds([id]);
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
