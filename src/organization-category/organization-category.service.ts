import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeleteResult, Repository} from "typeorm";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { AccountEntity } from "src/account/entities/account.entity";
import { OrganizationCategoryEntity } from "./entities/organization-category.entity";
import { CreateOrganizationCategoryDto } from "./dto/create-organization-category.dto";
import { OrganizationCategoryRO } from "./interfaces/organization-category.interface";
import { UpdateOrganizationCategoryDto } from "./dto/update-organization-category.dto";
import { InjectRepository } from "@nestjs/typeorm";



@Injectable()
export class OrganizationCategoryService {
    constructor(
        @InjectRepository(OrganizationCategoryEntity)
        private readonly zoneRepository: Repository<OrganizationCategoryEntity>
      ) { }

    async createEntity(payload: CreateOrganizationCategoryDto, user: AccountEntity) : Promise<string> {

        const isOrganizationCategoryExist = await this.zoneRepository.findOne({where: {name: payload.name}});
        if(isOrganizationCategoryExist) {
            throw new HttpException( `Organization category with ${payload.name} already exist`, HttpStatus.BAD_REQUEST);
        }

        const newOrganizationCategory = plainToClass(OrganizationCategoryEntity, payload);
        newOrganizationCategory.createdBy = user.createdBy;        

        const errors = await validate(newOrganizationCategory);

        if(errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        try {
             await this.zoneRepository.save(newOrganizationCategory);
             return "Organization category successfully saved";
        } catch(error)  {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getAll(): Promise<OrganizationCategoryRO[]> {
        
        return await this.zoneRepository.find();
    }

    async findById(id: string): Promise<OrganizationCategoryRO> {

        const organizationCategory = await this.zoneRepository.findOne(id);
        if(organizationCategory) {
            return organizationCategory;
        }
        throw new HttpException(`The organization category cannot be found`, HttpStatus.NOT_FOUND);

    }
    
    async delete(id: string): Promise<DeleteResult> {

        const organizationCategory = await this.zoneRepository.findOne(id);
        if(organizationCategory) {
            return await this.zoneRepository.delete(organizationCategory.id);
        }

        throw new HttpException(`The organization category cannot be found`, HttpStatus.NOT_FOUND);

    }

    async updateEntity(id: string, payload: UpdateOrganizationCategoryDto, user: AccountEntity) : Promise<string> {
        const organizationCategory = await this.zoneRepository.findOne(id);
        if (organizationCategory ) {

            if( organizationCategory.name != payload.name) {
                
                const nameExist = await this.zoneRepository.findOne({where: {name: payload.name}});
                if(nameExist){
                    throw new HttpException( `Organization category with ${payload.name} is already in use`, HttpStatus.BAD_REQUEST);
                }
            }
         

            organizationCategory.updatedAt = new Date();
            organizationCategory.updatedBy = user.updatedBy || user.createdBy;

            const updated = plainToClassFromExist(organizationCategory, payload);

            try {
                 await this.zoneRepository.save(updated);
                 return "Organization category successfully updated";
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        throw new HttpException(`The organization category cannot be found`, HttpStatus.NOT_FOUND);
    }

}