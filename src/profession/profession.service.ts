import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeleteResult, Repository} from "typeorm";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { AccountEntity } from "src/account/entities/account.entity";
import { ProfessionEntity } from "./entities/profession.entity";
import { CreateProfessionDto } from "./dto/create-profession.dto";
import { ProfessionRO } from "./interfaces/profession.interface";
import { UpdateProfessionDto } from "./dto/update-profession.dto";
import { InjectRepository } from "@nestjs/typeorm";



@Injectable()
export class ProfessionService {
    constructor(
        @InjectRepository(ProfessionEntity)
        private readonly zoneRepository: Repository<ProfessionEntity>
      ) { }

    async createEntity(payload: CreateProfessionDto, user: AccountEntity) : Promise<string> {

        const isProfessionExist = await this.zoneRepository.findOne({where: {name: payload.name}});
        if(isProfessionExist) {
            throw new HttpException( `Profession with ${payload.name} already exist`, HttpStatus.BAD_REQUEST);
        }

        const newProfession = plainToClass(ProfessionEntity, payload);
        newProfession.createdBy = user.createdBy;        

        const errors = await validate(newProfession);

        if(errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        try {
             await this.zoneRepository.save(newProfession);
             return "Profession successfully saved";
        } catch(error)  {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getAll(): Promise<ProfessionRO[]> {
        
        return await this.zoneRepository.find();
    }

    async findById(id: string): Promise<ProfessionRO> {

        const profession = await this.zoneRepository.findOne(id);
        if(profession) {
            return profession;
        }
        throw new HttpException(`The profession cannot be found`, HttpStatus.NOT_FOUND);

    }
    
    async delete(id: string): Promise<DeleteResult> {

        const profession = await this.zoneRepository.findOne(id);
        if(profession) {
            return await this.zoneRepository.delete(profession.id);
        }

        throw new HttpException(`The profession cannot be found`, HttpStatus.NOT_FOUND);

    }

    async updateEntity(id: string, payload: UpdateProfessionDto, user: AccountEntity) : Promise<string> {
        const profession = await this.zoneRepository.findOne(id);
        if (profession ) {

            if( profession.name != payload.name) {
                
                const nameExist = await this.zoneRepository.findOne({where: {name: payload.name}});
                if(nameExist){
                    throw new HttpException( `Profession with ${payload.name} is already in use`, HttpStatus.BAD_REQUEST);
                }
            }
         

            profession.updatedAt = new Date();
            profession.updatedBy = user.updatedBy || user.createdBy;

            const updated = plainToClassFromExist(profession, payload);

            try {
                 await this.zoneRepository.save(updated);
                 return "Profession successfully updated";
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        throw new HttpException(`The profession cannot be found`, HttpStatus.NOT_FOUND);
    }

}