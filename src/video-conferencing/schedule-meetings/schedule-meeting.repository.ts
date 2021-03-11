import { HttpException, HttpStatus } from "@nestjs/common";
import {DeleteResult, EntityRepository, Like, Repository} from "typeorm";
import { CreateScheduleMeetingDto } from "./dto/create-schedule-meeting.dto";
import {ScheduleMeetingEntity} from "./entities/schedule-meeting.entity";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { FilterDto } from "src/_common/filter.dto";
import { ScheduleMeetingsRO } from "./interfaces/schedule-meetings.interface";
import { UpdateScheduleMeetingDto } from "./dto/update-schedule-meeting.dto";
import {ILike} from "typeorm";
import { AccountEntity } from "src/account/entities/account.entity";



@EntityRepository(ScheduleMeetingEntity)
export class ScheduleMeetingRepository extends Repository<ScheduleMeetingEntity> {

    async saveMeetingSchedule(payload: CreateScheduleMeetingDto, user: AccountEntity) : Promise<ScheduleMeetingsRO> {
        
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

        const newMeetings = plainToClass(ScheduleMeetingEntity, payload);

        newMeetings.accountId = user.id;
        newMeetings.createdBy = user.createdBy;

        console.log(newMeetings);
        const errors = await validate(newMeetings);

        if(errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        try {
            return await this.save(newMeetings);

        } catch(error)  {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getAllMeetingsSchedules({search}: FilterDto): Promise<ScheduleMeetingsRO[]> {
        if(search) {
            const meetings = await this.find({ 
                where: [
                    { topic: ILike(`%${search}%`) },
                    { meetingID: ILike(`%${search}%`)}
                ]
            });

            return meetings;
        }

        return await this.find();
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
            return await this.delete({ id: meeting.id });
        }

        throw new HttpException(`The meeting with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);

    }

    async updateMeeting(id: string, payload: UpdateScheduleMeetingDto) : Promise<ScheduleMeetingsRO> {
        const meeting = await this.findOne(id);
        if (meeting && meeting.topic != payload.topic) {
            
            const topicExist = await this.findOne({where: {topic: ILike(`%${payload.topic}%`)}});
            
            if(topicExist){
                throw new HttpException( `Meeting with ${payload.topic} is already in use`, HttpStatus.BAD_REQUEST);
            }

            meeting.updatedAt = new Date();
            meeting.updatedBy = payload.updatedBy;
            const updated = plainToClassFromExist(meeting, payload);

            try {
                return await this.save(updated);

            } catch (error) {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        throw new HttpException(`The meeting with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);
    }


    async startMeeting(id: string): Promise<ScheduleMeetingsRO> {
        const meeting = await this.findOne(id);

        if(meeting) {

            // function hourwithAMPM(dateInput) {
            //     var d = new Date(dateInput);
            //     var ampm = (d.getHours() >= 12) ? "PM" : "AM";
            //     var hours = (d.getHours() >= 12) ? d.getHours()-12 : d.getHours();
            //     return `$`
            //     return hours+':'+d.getMinutes()+' '+ampm;
             
            //  }
             //console.log(hourwithAMPM(new Date()))

             //const today = new Date();

             meeting.meetingStarted = true;
             const updated = plainToClassFromExist(ScheduleMeetingEntity, meeting);
            return await this.save(updated);
        }

        throw new HttpException(`The meeting with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);

    }

    async endMeeting(id: string): Promise<ScheduleMeetingsRO> {
        const meeting = await this.findOne(id);
        if(meeting) {
             meeting.meetingEnded = true;
             const updated = plainToClassFromExist(ScheduleMeetingEntity, meeting);
            return await this.save(updated);
        }

        throw new HttpException(`The meeting with ID ${id} cannot be found`, HttpStatus.NOT_FOUND);

    }
   

}