import { Injectable } from "@nestjs/common";
import { AdvertCategoryRO } from "./advertcategory.interface";
import { AdvertCategoryRepository } from "./advertcategory.repository";
import { CreateAdvertCategoryDto } from "./dto/create-advertcategory";
import { UpdateAdvertCategoryDto } from "./dto/update-advertcategory";

@Injectable()
export class AdvertCategoryService {
    constructor(private readonly advertCategoryRepository: AdvertCategoryRepository) { }

    async create(
        dto: CreateAdvertCategoryDto,
        
    ): Promise<AdvertCategoryRO> {
        return await this.advertCategoryRepository.createEntity(dto);
    }
    
    async update( id: string, dto: UpdateAdvertCategoryDto): Promise<AdvertCategoryRO> {
        return await this.advertCategoryRepository.updateEntity(id,dto);
    }

    async findAll(): Promise<AdvertCategoryRO[]> {
        return await this.advertCategoryRepository.findAll();
    }

    async findOne(id: string): Promise<AdvertCategoryRO> {
        return await this.advertCategoryRepository.findById(id);
    }

    async remove(id: string) {
        return await this.advertCategoryRepository.deleteEntity(id);
    }
}