import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeleteResult, Repository} from "typeorm";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { AccountEntity } from "src/account/entities/account.entity";
import { OrganizationTypeEntity } from "./entities/organization-type.entity";
import { CreateOrganizationTypeDto } from "./dto/create-organization-type.dto";
import { OrganizationTypeRO } from "./interfaces/organization-type.interface";
import { UpdateOrganizationTypeDto } from "./dto/update-organization-type.dto";
import { InjectRepository } from "@nestjs/typeorm";



@Injectable()
export class OrganizationTypeService {
    constructor(
        @InjectRepository(OrganizationTypeEntity)
        private readonly zoneRepository: Repository<OrganizationTypeEntity>
      ) { }

    async createEntity(payload: CreateOrganizationTypeDto, user: AccountEntity) : Promise<string> {

        const isOrganizationTypeExist = await this.zoneRepository.findOne({where: {name: payload.name}});
        if(isOrganizationTypeExist) {
            throw new HttpException( `Organization type with ${payload.name} already exist`, HttpStatus.BAD_REQUEST);
        }

        const newOrganizationType = plainToClass(OrganizationTypeEntity, payload);
        newOrganizationType.createdBy = user.createdBy;        

        const errors = await validate(newOrganizationType);

        if(errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        try {
             await this.zoneRepository.save(newOrganizationType);
             return "Organization type successfully saved";
        } catch(error)  {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getAll(): Promise<OrganizationTypeRO[]> {
        
        return await this.zoneRepository.find();
    }

    async findById(id: string): Promise<OrganizationTypeRO> {

        const organizationType = await this.zoneRepository.findOne(id);
        if(organizationType) {
            return organizationType;
        }
        throw new HttpException(`The organization type cannot be found`, HttpStatus.NOT_FOUND);

    }
    
    async delete(id: string): Promise<DeleteResult> {

        const organizationType = await this.zoneRepository.findOne(id);
        if(organizationType) {
            return await this.zoneRepository.delete(organizationType.id);
        }

        throw new HttpException(`The organization type cannot be found`, HttpStatus.NOT_FOUND);

    }

    async updateEntity(id: string, payload: UpdateOrganizationTypeDto, user: AccountEntity) : Promise<string> {
        const organizationType = await this.zoneRepository.findOne(id);
        if (organizationType ) {

            if( organizationType.name != payload.name) {
                
                const nameExist = await this.zoneRepository.findOne({where: {name: payload.name}});
                if(nameExist){
                    throw new HttpException( `Organization type with ${payload.name} is already in use`, HttpStatus.BAD_REQUEST);
                }
            }
         

            organizationType.updatedAt = new Date();
            organizationType.updatedBy = user.updatedBy || user.createdBy;

            const updated = plainToClassFromExist(organizationType, payload);

            try {
                 await this.zoneRepository.save(updated);
                 return "Organization type successfully updated";
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        throw new HttpException(`The organization type cannot be found`, HttpStatus.NOT_FOUND);
    }

}