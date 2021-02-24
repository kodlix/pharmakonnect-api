import { Injectable } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { SectorRO } from './sector.interface';
import { SectorRepository } from './sector.repository';

@Injectable()
export class SectorService {
  constructor(
    private readonly sectorRepository: SectorRepository
  ) { }

  async create(dto: CreateSectorDto): Promise<SectorRO> {
    return await this.sectorRepository.createEntity(dto);
  }

  async findAll(): Promise<SectorRO[]> {
    return await this.sectorRepository.findAll();
  }

  async findOne(id: string): Promise<SectorRO> {
    return await this.sectorRepository.findById(id);
  }

  async update(id: string, dto: UpdateSectorDto): Promise<SectorRO> {
    return await this.sectorRepository.updateEntity(id, dto);
  }

  async remove(id: string): Promise<DeleteResult> {
    const result =  await this.sectorRepository.deleteEnity(id);
    return result;
  }
}
