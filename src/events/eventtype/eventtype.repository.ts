import { HttpException, HttpStatus } from "@nestjs/common";
import {Brackets, DeleteResult, EntityRepository, ILike, Like, Repository} from "typeorm";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { FilterDto } from "src/_common/filter.dto";
import { AccountEntity } from "src/account/entities/account.entity";
import { EventTypeEntity } from "./entities/eventtype.entity";
import { CreateEventtypeDto } from "./dto/create-eventtype.dto";
import { EventTypeRO } from "./interfaces/eventtype.interface";
import { UpdateEventtypeDto } from "./dto/update-eventtype.dto";


@EntityRepository(EventTypeEntity)
export class EventTypeRepository extends Repository<EventTypeEntity> {

    async saveEventType(payload: CreateEventtypeDto, user: AccountEntity) : Promise<string> {

        const iseventTypeNameExist = await this.findOne({where: {name: ILike(`%${payload.name}%`)}});
        if(iseventTypeNameExist) {
            throw new HttpException( `Event type with ${payload.name} already exist`, HttpStatus.BAD_REQUEST);
        }

        const newEventType = plainToClass(EventTypeEntity, payload);

        newEventType.createdBy = user.createdBy;
        

        const errors = await validate(newEventType);

        if(errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        try {
             await this.save(newEventType);
             return "Event Type successfully saved";
        } catch(error)  {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getAllEventTypes(): Promise<EventTypeRO[]> {
        
        return await this.find();
    }

    async findEventTypeById(id: string): Promise<EventTypeRO> {

        const eventType = await this.findOne(id);
        if(eventType) {
            return eventType;
        }
        throw new HttpException(`The event type with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);

    }
    
    async deleteEventType(id: string): Promise<DeleteResult> {

        const eventType = await this.findOne(id);
        if(eventType) {
            return await this.delete({ id: eventType.id });
        }

        throw new HttpException(`The event type with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);

    }

    async updateEventType(id: string, payload: UpdateEventtypeDto, user: AccountEntity) : Promise<string> {
        const eventType = await this.findOne(id);
        if (eventType ) {

            if( eventType.name != payload.name) {
                
                const nameExist = await this.findOne({where: {name: ILike(`%${payload.name}%`)}});
                if(nameExist){
                    throw new HttpException( `Meeting with ${payload.name} is already in use`, HttpStatus.BAD_REQUEST);
                }
            }
         

            eventType.updatedAt = new Date();
            eventType.updatedBy = user.updatedBy || user.createdBy;

            const updated = plainToClassFromExist(eventType, payload);

            try {
                 await this.save(updated);
                 return "Event Type successfully updated";
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        throw new HttpException(`The event type with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);
    }

}