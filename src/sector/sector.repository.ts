import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository, EntityRepository, DeleteResult } from 'typeorm';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { SectorEntity } from './entities/sector.entity';
import { SectorRO } from './sector.interface';

@EntityRepository(SectorEntity)
export class SectorRepository extends Repository<SectorEntity> {
    async createEntity(dto: CreateSectorDto): Promise<SectorEntity> {

        const { name, description, createdBy } = dto;            
            
        let exists = await this.findOne({ name });
        if (exists) {
            throw new HttpException({ message: `sector with name '${dto.name}' already exists` }, HttpStatus.BAD_REQUEST);
        }

        const sector = await this.create();
        sector.name = name;
        sector.description = description;
        sector.createdBy =  createdBy;

        return await sector.save();
    }

    async updateEntity(id: string, dto: UpdateSectorDto): Promise<SectorEntity> {

        const sector = await this.findOne(id);

        sector.name = dto.name;
        sector.description = dto.description;
        sector.updatedAt = new Date();
        sector.updatedBy = dto.UpdatedBy;
        return await sector.save();
    }

    async deleteEnity(id: string): Promise<DeleteResult> {

        const sector = await this.findOne(id);
        return await this.delete(sector);
    }

    async findById(id: string): Promise<SectorEntity> {

        const sector = await this.findOne(id);
        return sector;
    }

    async findAll(): Promise<SectorEntity[]> {
        const sectors = await this.find();
        return sectors;
    }
}