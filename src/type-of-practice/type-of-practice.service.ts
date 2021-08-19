import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeleteResult, Repository} from "typeorm";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { AccountEntity } from "src/account/entities/account.entity";
import { TypeOfPracticeEntity } from "./entities/type-of-practice.entity";
import { CreateTypeOfPracticeDto } from "./dto/create-type-of-practice.dto";
import { TypeOfPracticeRO } from "./interfaces/type-of-practice.interface";
import { UpdateTypeOfPracticeDto } from "./dto/update-type-of-practice.dto";


@Injectable()
export class TypeOfPracticeService extends Repository<TypeOfPracticeEntity> {

    async createEntity(payload: CreateTypeOfPracticeDto, user: AccountEntity) : Promise<string> {

        const isTypeOfPracticeExist = await this.findOne({where: {name: payload.name}});
        if(isTypeOfPracticeExist) {
            throw new HttpException( `Type of practice with ${payload.name} already exist`, HttpStatus.BAD_REQUEST);
        }

        const newTypeOfPractice = plainToClass(TypeOfPracticeEntity, payload);
        newTypeOfPractice.createdBy = user.createdBy;        

        const errors = await validate(newTypeOfPractice);

        if(errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        try {
             await this.save(newTypeOfPractice);
             return "Type of practice successfully saved";
        } catch(error)  {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getAll(): Promise<TypeOfPracticeRO[]> {
        
        return await this.find();
    }

    async findById(id: string): Promise<TypeOfPracticeRO> {

        const typeOfPractice = await this.findOne(id);
        if(typeOfPractice) {
            return typeOfPractice;
        }
        throw new HttpException(`The type of practice cannot be found`, HttpStatus.NOT_FOUND);

    }
    
    async delete(id: string): Promise<DeleteResult> {

        const typeOfPractice = await this.findOne(id);
        if(typeOfPractice) {
            return await this.delete(typeOfPractice.id);
        }

        throw new HttpException(`The type of practice cannot be found`, HttpStatus.NOT_FOUND);

    }

    async updateEntity(id: string, payload: UpdateTypeOfPracticeDto, user: AccountEntity) : Promise<string> {
        const typeOfPractice = await this.findOne(id);
        if (typeOfPractice ) {

            if( typeOfPractice.name != payload.name) {
                
                const nameExist = await this.findOne({where: {name: payload.name}});
                if(nameExist){
                    throw new HttpException( `Type of practice with ${payload.name} is already in use`, HttpStatus.BAD_REQUEST);
                }
            }
         

            typeOfPractice.updatedAt = new Date();
            typeOfPractice.updatedBy = user.updatedBy || user.createdBy;

            const updated = plainToClassFromExist(typeOfPractice, payload);

            try {
                 await this.save(updated);
                 return "Type of practice successfully updated";
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        throw new HttpException(`The type of practice cannot be found`, HttpStatus.NOT_FOUND);
    }

}