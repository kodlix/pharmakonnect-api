import { Injectable } from "@nestjs/common";
import { AccountEntity } from "src/account/entities/account.entity";
import { CountryEntity } from "src/country/entities/country.entity";
import { LgaEntity } from "src/lga/entities/lga.entity";
import { StateEntity } from "src/state/entities/state.entity";
import { CreateOutletDto } from "./dto/create-outlet.dto";
import { UpdateOutletDto } from "./dto/update-outlet.dto";
import { OutletRO } from "./outlet.interface";
import { OutletRepository } from "./outlet.repository";

@Injectable()
export class OutletService {
    constructor(private readonly outletRepository: OutletRepository) { }

    async create(
        dto: CreateOutletDto,
        user: AccountEntity,
        
    ): Promise<OutletRO> {
        return await this.outletRepository.createEntity(dto, user);
    }
    async findAll(page, searchParam): Promise<OutletRO[]> {
        return await this.outletRepository.findAll(page, searchParam);
    }

    async findOne(id: string): Promise<OutletRO> {
        return await this.outletRepository.findById(id);
    }

    async findByAccountId(accountId: string, page,searchParam): Promise<OutletRO[]> {
        return await this.outletRepository.findByAccountId(accountId, page,searchParam);
    }

    async update(id: string, dto: UpdateOutletDto, user: AccountEntity): Promise<OutletRO> {
        return await this.outletRepository.updateEntity(id, dto, user);
    }

    async remove(id: string) {
        return await this.outletRepository.deleteEntity(id);
    }
}