import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeleteResult, Repository} from "typeorm";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { AccountEntity } from "src/account/entities/account.entity";
import { ProfessionalGroupEntity } from "./entities/professional-group.entity";
import { CreateProfessionalGroupDto } from "./dto/create-professional-group.dto";
import { ProfessionalGroupRO } from "./interfaces/professional-group.interface";
import { UpdateProfessionalGroupDto } from "./dto/update-professional-group.dto";
import { InjectRepository } from "@nestjs/typeorm";



@Injectable()
export class ProfessionalGroupService {
    constructor(
        @InjectRepository(ProfessionalGroupEntity)
        private readonly zoneRepository: Repository<ProfessionalGroupEntity>
      ) { }

    async createEntity(payload: CreateProfessionalGroupDto, user: AccountEntity) : Promise<string> {

        const isProfessionalGroupExist = await this.zoneRepository.findOne({where: {name: payload.name}});
        if(isProfessionalGroupExist) {
            throw new HttpException( `Professional group with ${payload.name} already exist`, HttpStatus.BAD_REQUEST);
        }

        const newProfessionalGroup = plainToClass(ProfessionalGroupEntity, payload);
        newProfessionalGroup.createdBy = user.createdBy;        

        const errors = await validate(newProfessionalGroup);

        if(errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        try {
             await this.zoneRepository.save(newProfessionalGroup);
             return "Professional group successfully saved";
        } catch(error)  {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getAll(): Promise<ProfessionalGroupRO[]> {
        
        return await this.zoneRepository.find();
    }

    async findById(id: string): Promise<ProfessionalGroupRO> {

        const professionalGroup = await this.zoneRepository.findOne(id);
        if(professionalGroup) {
            return professionalGroup;
        }
        throw new HttpException(`The professional group cannot be found`, HttpStatus.NOT_FOUND);

    }
    
    async delete(id: string): Promise<DeleteResult> {

        const professionalGroup = await this.zoneRepository.findOne(id);
        if(professionalGroup) {
            return await this.zoneRepository.delete(professionalGroup.id);
        }

        throw new HttpException(`The professional group cannot be found`, HttpStatus.NOT_FOUND);

    }

    async updateEntity(id: string, payload: UpdateProfessionalGroupDto, user: AccountEntity) : Promise<string> {
        const professionalGroup = await this.zoneRepository.findOne(id);
        if (professionalGroup ) {

            if( professionalGroup.name != payload.name) {
                
                const nameExist = await this.zoneRepository.findOne({where: {name: payload.name}});
                if(nameExist){
                    throw new HttpException( `Professional group with ${payload.name} is already in use`, HttpStatus.BAD_REQUEST);
                }
            }
         

            professionalGroup.updatedAt = new Date();
            professionalGroup.updatedBy = user.updatedBy || user.createdBy;

            const updated = plainToClassFromExist(professionalGroup, payload);

            try {
                 await this.zoneRepository.save(updated);
                 return "Professional group successfully updated";
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        throw new HttpException(`The professional group cannot be found`, HttpStatus.NOT_FOUND);
    }

    getOneProfessionalGroup(id: string): Promise<ProfessionalGroupEntity> {
        return this.zoneRepository.findOneOrFail(id, {
          relations: ['users'],
        });
    }

}