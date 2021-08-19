import { HttpException, HttpStatus } from "@nestjs/common";
import { DeleteResult, EntityRepository, ILike, Like, Repository} from "typeorm";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { AccountEntity } from "src/account/entities/account.entity";
import { ModuleEntity } from "./entities/module.entity";
import { CreateModuleDto } from "./dto/create-module.dto";
import { ModuleRO } from "./interfaces/module.interface";
import { UpdateModuleDto } from "./dto/update-module.dto";


@EntityRepository(ModuleEntity)
export class ModuleRepository extends Repository<ModuleEntity> {

    async saveModule(payload: CreateModuleDto, user: AccountEntity) : Promise<string> {

        const ismoduleNameExist = await this.findOne({where: {name: ILike(`%${payload.name}%`)}});
        if(ismoduleNameExist) {
            throw new HttpException( `Module with ${payload.name} already exist`, HttpStatus.BAD_REQUEST);
        }

        const newModule = plainToClass(ModuleEntity, payload);

        newModule.createdBy = user.createdBy;
        

        const errors = await validate(newModule);

        if(errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        try {
             await this.save(newModule);
             return "Module successfully saved";
        } catch(error)  {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getAllModules(): Promise<ModuleRO[]> {
        
        return await this.find();
    }

    async findModuleById(id: string): Promise<ModuleRO> {

        const module = await this.findOne(id);
        if(module) {
            return module;
        }
        throw new HttpException(`The module with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);

    }
    
    async deleteModule(id: string): Promise<DeleteResult> {

        const module = await this.findOne(id);
        if(module) {
            return await this.delete({ id: module.id });
        }

        throw new HttpException(`The module with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);

    }

    async updateModule(id: string, payload: UpdateModuleDto, user: AccountEntity) : Promise<string> {
        const module = await this.findOne(id);
        if (module ) {

            if( module.name != payload.name) {
                
                const nameExist = await this.findOne({where: {name: payload.name}});
                if(nameExist){
                    throw new HttpException( `Module with ${payload.name} is already in use`, HttpStatus.BAD_REQUEST);
                }
            }
         

            module.updatedAt = new Date();
            module.updatedBy = user.updatedBy || user.createdBy;

            const updated = plainToClassFromExist(module, payload);

            try {
                 await this.save(updated);
                 return "Module successfully updated";
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        throw new HttpException(`The module type with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);
    }

}