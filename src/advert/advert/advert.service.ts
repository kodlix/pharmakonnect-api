import { Injectable } from "@nestjs/common";
import { AccountEntity } from "src/account/entities/account.entity";
import { AdvertRO } from "./advert.interface";
import { AdvertRepository } from "./advert.repository";
import { CreateAdvertDto } from "./dto/create-advert";
import { ApproveAdvertDto, RejectAdvertDto, UpdateAdvertDto } from "./dto/update-advert";

@Injectable()
export class AdvertService{
    constructor(private readonly advertRepository: AdvertRepository) { }

    async create(
        dto: CreateAdvertDto,
        user: AccountEntity,
        filename: string

    ): Promise<AdvertRO> {
        return await this.advertRepository.createEntity(dto, user,filename);
    }

    async update(id: string, dto: UpdateAdvertDto, user: AccountEntity, filename: string): Promise<AdvertRO> {
        return await this.advertRepository.updateEntity(id, dto, user,filename);
    }

    async updateApprove(
        id: string,
        user: AccountEntity
      ): Promise<AdvertRO> {
        return await this.advertRepository.updateApprove(id, user);
      }
    
      async updateReject(
        id: string,
        dto: RejectAdvertDto,
        user: AccountEntity
      ): Promise<AdvertRO> {
        return await this.advertRepository.updateReject(id, dto, user);
      }

    // async uploadAdvertImage(advertImage: string, advertId: string) {
    //     return await this.advertRepository.uploadAdvertImage(advertImage, advertId);
    // }

    async findAll(page, search): Promise<AdvertRO[]> {
        return await this.advertRepository.findall(page, search);
    }

    async findOne(id: string): Promise<AdvertRO> {
        return await this.advertRepository.findById(id);
    }

    async findByAccountId(accountId: string, page): Promise<AdvertRO[]> {
        return await this.advertRepository.findByAccountId(accountId, page);
    }

    
    async findByApproved( page): Promise<AdvertRO[]> {
        return await this.advertRepository.findByAprroved(page);
    }

    async remove(id: string) {
        return await this.advertRepository.deleteEntity(id);
    }

} 