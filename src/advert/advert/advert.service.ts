import { Injectable } from "@nestjs/common";
import { AccountEntity } from "src/account/entities/account.entity";
import { AdvertRO } from "./advert.interface";
import { AdvertRepository } from "./advert.repository";
import { CreateAdvertDto } from "./dto/create-advert";
import { UpdateAdvertDto } from "./dto/update-advert";

@Injectable()
export class AdvertService{
    constructor(private readonly advertRepository: AdvertRepository) { }

    async create(
        dto: CreateAdvertDto,
        user: AccountEntity
    ): Promise<AdvertRO> {
        return await this.advertRepository.createEntity(dto, user);
    }

    async update(id: string, dto: UpdateAdvertDto, user: AccountEntity): Promise<AdvertRO> {
        return await this.advertRepository.updateEntity(id, dto, user);
    }

    async uploadAdvertImage(advertImage: string, advertId: string) {
        return await this.advertRepository.uploadAdvertImage(advertImage, advertId);
    }

    async findAll(page, search): Promise<AdvertRO[]> {
        return await this.advertRepository.findall(page, search);
    }

    async findOne(id: string): Promise<AdvertRO> {
        return await this.advertRepository.findById(id);
    }

    async findByAccountId(accountId: string, page): Promise<AdvertRO[]> {
        return await this.advertRepository.findByAccountId(accountId, page);
    }

    async remove(id: string) {
        return await this.advertRepository.deleteEntity(id);
    }

} 