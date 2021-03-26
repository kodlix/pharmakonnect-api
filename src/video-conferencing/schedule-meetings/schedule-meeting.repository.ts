import { HttpException, HttpStatus } from "@nestjs/common";
import {Brackets, DeleteResult, EntityRepository, Like, Repository} from "typeorm";
import { CreateScheduleMeetingDto } from "./dto/create-schedule-meeting.dto";
import {ScheduleMeetingEntity} from "./entities/schedule-meeting.entity";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { FilterDto } from "src/_common/filter.dto";
import { ScheduleMeetingsRO } from "./interfaces/schedule-meetings.interface";
import { UpdateScheduleMeetingDto } from "./dto/update-schedule-meeting.dto";
import {ILike, Equal} from "typeorm";
import { AccountEntity } from "src/account/entities/account.entity";
import {isNotValidTime} from "../../_utility/time-validator.util";



@EntityRepository(ScheduleMeetingEntity)
export class ScheduleMeetingRepository extends Repository<ScheduleMeetingEntity> {

    async saveMeetingSchedule(payload: CreateScheduleMeetingDto, user: AccountEntity) : Promise<string> {
        
        const isMeetingTopicExist = await this.findOne({where: {topic: ILike(`%${payload.topic}%`)}});
        if(isMeetingTopicExist) {
            throw new HttpException( `Meeting with ${payload.topic} already exist`, HttpStatus.BAD_REQUEST);
        }
        
        const today = new Date();

        if(!user.id) {
            throw new HttpException( `User ID is required`, HttpStatus.UNAUTHORIZED);
        }

        if(today > payload.startDate) {
            throw new HttpException( `Meeting Start Date ${payload.startDate} cannot be less than current date`, HttpStatus.BAD_REQUEST);
        }
    
        if (isNotValidTime(payload.startTime)) {
            throw new HttpException( `Meeting Start Time cannot be in the past.`, HttpStatus.BAD_REQUEST);
        } 

        const newMeetings = plainToClass(ScheduleMeetingEntity, payload);

        newMeetings.accountId = user.id;
        newMeetings.schedulerEmail = user.email;
        newMeetings.schedulerName = `${user.firstName} ${user.lastName}`;
        newMeetings.createdBy = user.createdBy;

        const errors = await validate(newMeetings);

        if(errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        try {
             await this.save(newMeetings);
             return "Meeting successfully saved";
        } catch(error)  {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getAllMeetingsSchedules({search}: FilterDto, user: AccountEntity): Promise<ScheduleMeetingsRO[]> {
        
        if(!user.id) {
            throw new HttpException( `User Id is required.`, HttpStatus.BAD_REQUEST);
        }
        
        if(search) {

           const meetings =  await this.createQueryBuilder("meet")
                    .where("meet.accountId = :accountId", { accountId: user.id })
                    .andWhere(new Brackets(qb => {
                        qb.where("meet.topic ILike :topic", { topic: `%${search}%` })
                        .orWhere("meet.meetingID ILike :meetingID", { meetingID: `%${search}%` })
                    })).getMany();

            return meetings;
        }

        return await this.find({where: {accountId: user.id}});
    }

    async findMeetingById(id: string): Promise<ScheduleMeetingsRO> {

        const meeting = await this.findOne(id);
        if(meeting) {
            return meeting;
        }
        throw new HttpException(`The meeting with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);

    }

    async findMeetingByAccountId(accountId: string): Promise<ScheduleMeetingsRO[]> {

        const meeting = await this.find({ where: { accountId: accountId }});
        return meeting;
    }

    
    async deleteMeeting(id: string): Promise<DeleteResult> {

        const meeting = await this.findOne(id);
        if(meeting) {
            if(meeting.meetingStarted && !meeting.meetingEnded) {
                throw new HttpException(`Meeting is in progress and therefore cannot be deleted`, HttpStatus.BAD_REQUEST);
            }
            return await this.delete({ id: meeting.id });
        }

        throw new HttpException(`The meeting with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);

    }

    async updateMeeting(id: string, payload: UpdateScheduleMeetingDto, user: AccountEntity) : Promise<string> {
        const meeting = await this.findOne(id);
        if (meeting ) {

            if( meeting.topic != payload.topic) {
                const topicExist = await this.findOne({where: {topic: ILike(`%${payload.topic}%`)}});
            
                if(topicExist){
                    throw new HttpException( `Meeting with ${payload.topic} is already in use`, HttpStatus.BAD_REQUEST);
                }
            }
        
            const today = new Date();

            if(today > payload.startDate) {
                throw new HttpException( `Meeting Start Date ${payload.startDate} cannot be less than current date`, HttpStatus.BAD_REQUEST);
            }

            if (isNotValidTime(payload.startTime)) {
                throw new HttpException( `Meeting Start Time cannot be in the past.`, HttpStatus.BAD_REQUEST);
            } 

            meeting.updatedAt = new Date();
            meeting.updatedBy = user.updatedBy || user.createdBy;

            const updated = plainToClassFromExist(meeting, payload);

            try {
                 await this.save(updated);
                 return "Meeting successfully updated";
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        throw new HttpException(`The meeting with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);
    }

}