/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { AccountEntity } from "src/account/entities/account.entity";
import { CreateFeatureDto } from "./dto/createfeature.dto";
import { UpdateFeatureDto } from "./dto/update-feature.dto";
import { FeatureRO } from "./feature.interface";
import { FeatureRepository } from "./feature.repository";

@Injectable()
export class FeatureService {
    constructor(private readonly featureRepository: FeatureRepository) { }

    async create(
        dto: CreateFeatureDto,
        user: AccountEntity,
        
    ): Promise<FeatureRO> {
        return await this.featureRepository.createEntity(dto,user);
    }
    
    async update(id: string, dto: UpdateFeatureDto): Promise<FeatureRO> {
        return await this.featureRepository.updateEntity(id, dto);
    }

    async findAll(): Promise<FeatureRO[]> {
        return await this.featureRepository.findAll();
    }

    async remove(id: string) {
        return await this.featureRepository.deleteEntity(id);
    }
}