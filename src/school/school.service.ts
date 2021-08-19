import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeleteResult, Repository} from "typeorm";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { AccountEntity } from "src/account/entities/account.entity";
import { SchoolEntity } from "./entities/school.entity";
import { CreateSchoolDto } from "./dto/create-school.dto";
import { SchoolRO } from "./interfaces/school.interface";
import { UpdateSchoolDto } from "./dto/update-school.dto";


@Injectable()
export class SchoolService extends Repository<SchoolEntity> {

    async createEntity(payload: CreateSchoolDto, user: AccountEntity) : Promise<string> {

        const isSchoolExist = await this.findOne({where: {name: payload.name}});
        if(isSchoolExist) {
            throw new HttpException( `School with ${payload.name} already exist`, HttpStatus.BAD_REQUEST);
        }

        const newSchool = plainToClass(SchoolEntity, payload);
        newSchool.createdBy = user.createdBy;        

        const errors = await validate(newSchool);

        if(errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        try {
             await this.save(newSchool);
             return "School successfully saved";
        } catch(error)  {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getAll(): Promise<SchoolRO[]> {
        
        return await this.find();
    }

    async findById(id: string): Promise<SchoolRO> {

        const school = await this.findOne(id);
        if(school) {
            return school;
        }
        throw new HttpException(`The school cannot be found`, HttpStatus.NOT_FOUND);

    }
    
    async delete(id: string): Promise<DeleteResult> {

        const school = await this.findOne(id);
        if(school) {
            return await this.delete(school.id);
        }

        throw new HttpException(`The school cannot be found`, HttpStatus.NOT_FOUND);

    }

    async updateEntity(id: string, payload: UpdateSchoolDto, user: AccountEntity) : Promise<string> {
        const school = await this.findOne(id);
        if (school ) {

            if( school.name != payload.name) {
                
                const nameExist = await this.findOne({where: {name: payload.name}});
                if(nameExist){
                    throw new HttpException( `School with ${payload.name} is already in use`, HttpStatus.BAD_REQUEST);
                }
            }
         

            school.updatedAt = new Date();
            school.updatedBy = user.updatedBy || user.createdBy;

            const updated = plainToClassFromExist(school, payload);

            try {
                 await this.save(updated);
                 return "School successfully updated";
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        throw new HttpException(`The school cannot be found`, HttpStatus.NOT_FOUND);
    }

}