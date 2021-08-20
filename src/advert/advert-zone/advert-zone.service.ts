import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeleteResult, Repository} from "typeorm";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { AccountEntity } from "src/account/entities/account.entity";
import { AdvertZoneEntity } from "./entities/advert-zone.entity";
import { CreateAdvertZoneDto } from "./dto/create-advert-zone.dto";
import { AdvertZoneRO } from "./interfaces/advert-zone.interface";
import { UpdateAdvertZoneDto } from "./dto/update-advert-zone.dto";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class AdvertZoneService  {
    constructor(
        @InjectRepository(AdvertZoneEntity)
        private readonly zoneRepository: Repository<AdvertZoneEntity>
      ) { }

    async createEntity(payload: CreateAdvertZoneDto, user: AccountEntity) : Promise<string> {

        const isAdvertZoneExist = await this.zoneRepository.findOne({where: {name: payload.name}});
        if(isAdvertZoneExist) {
            throw new HttpException( `Advert zone with ${payload.name} already exist`, HttpStatus.BAD_REQUEST);
        }

        const newAdvertZone = plainToClass(AdvertZoneEntity, payload);
        newAdvertZone.createdBy = user.createdBy;        

        const errors = await validate(newAdvertZone);

        if(errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        try {
             await this.zoneRepository.save(newAdvertZone);
             return "Advert zone successfully saved";
        } catch(error)  {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getAll(): Promise<AdvertZoneRO[]> {
        
        return await this.zoneRepository.find();
    }

    async findById(id: string): Promise<AdvertZoneRO> {

        const advertZone = await this.zoneRepository.findOne(id);
        if(advertZone) {
            return advertZone;
        }
        throw new HttpException(`The advert zone cannot be found`, HttpStatus.NOT_FOUND);

    }
    
    async delete(id: string): Promise<DeleteResult> {

        const advertZone = await this.zoneRepository.findOne(id);
        if(advertZone) {
            return await this.zoneRepository.delete(advertZone.id);
        }

        throw new HttpException(`The advert zone cannot be found`, HttpStatus.NOT_FOUND);

    }

    async updateEntity(id: string, payload: UpdateAdvertZoneDto, user: AccountEntity) : Promise<string> {
        const advertZone = await this.zoneRepository.findOne(id);
        if (advertZone ) {

            if( advertZone.name != payload.name) {
                
                const nameExist = await this.zoneRepository.findOne({where: {name: payload.name}});
                if(nameExist){
                    throw new HttpException( `Advert zone with ${payload.name} is already in use`, HttpStatus.BAD_REQUEST);
                }
            }
         

            advertZone.updatedAt = new Date();
            advertZone.updatedBy = user.updatedBy || user.createdBy;

            const updated = plainToClassFromExist(advertZone, payload);

            try {
                 await this.zoneRepository.save(updated);
                 return "Advert zone successfully updated";
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        throw new HttpException(`The advert zone cannot be found`, HttpStatus.NOT_FOUND);
    }

}