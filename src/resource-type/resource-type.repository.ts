import { HttpException, HttpStatus } from "@nestjs/common";
import { DeleteResult, EntityRepository, ILike, Like, Repository} from "typeorm";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { AccountEntity } from "src/account/entities/account.entity";
import { ResourceTypeEntity } from "./entities/resource-type.entity";
import { CreateResourceTypeDto } from "./dto/create-resource-type.dto";
import { ResourceTypeRO } from "./interfaces/resource-type.interface";
import { UpdateResourceTypeDto } from "./dto/update-resource-type.dto";


@EntityRepository(ResourceTypeEntity)
export class ResourceTypeRepository extends Repository<ResourceTypeEntity> {

    async saveResourceType(payload: CreateResourceTypeDto, user: AccountEntity) : Promise<string> {

        const isresourceTypeNameExist = await this.findOne({where: {name: payload.name}});
        if(isresourceTypeNameExist) {
            throw new HttpException( `Resource type with ${payload.name} already exist`, HttpStatus.BAD_REQUEST);
        }

        const newResourceType = plainToClass(ResourceTypeEntity, payload);

        newResourceType.createdBy = user.createdBy;
        

        const errors = await validate(newResourceType);

        if(errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        try {
             await this.save(newResourceType);
             return "Resource Type successfully saved";
        } catch(error)  {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getAllResourceTypes(): Promise<ResourceTypeRO[]> {
        
        return await this.find();
    }

    async findResourceTypeById(id: string): Promise<ResourceTypeRO> {

        const resourceType = await this.findOne(id);
        if(resourceType) {
            return resourceType;
        }
        throw new HttpException(`The resource type with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);

    }
    
    async deleteResourceType(id: string): Promise<DeleteResult> {

        const resourceType = await this.findOne(id);
        if(resourceType) {
            return await this.delete({ id: resourceType.id });
        }

        throw new HttpException(`The resource type with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);

    }

    async updateResourceType(id: string, payload: UpdateResourceTypeDto, user: AccountEntity) : Promise<string> {
        const resourceType = await this.findOne(id);
        if (resourceType ) {

            if( resourceType.name != payload.name) {
                
                const nameExist = await this.findOne({where: {name: payload.name}});
                if(nameExist){
                    throw new HttpException( `Resource type with ${payload.name} is already in use`, HttpStatus.BAD_REQUEST);
                }
            }
         

            resourceType.updatedAt = new Date();
            resourceType.updatedBy = user.updatedBy || user.createdBy;

            const updated = plainToClassFromExist(resourceType, payload);

            try {
                 await this.save(updated);
                 return "Resource Type successfully updated";
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        throw new HttpException(`The resource type with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);
    }

}