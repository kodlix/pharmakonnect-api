import { HttpException, HttpStatus } from "@nestjs/common";
import {DeleteResult, EntityRepository, Like, Repository} from "typeorm";
import { CreateScheduleMeetingDto } from "./dto/create-schedule-meeting.dto";
import {ScheduleMeetingEntity} from "./entities/schedule-meeting.entity";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { FilterDto } from "src/_common/filter.dto";
import { ScheduleMeetingsRO } from "./interfaces/schedule-meetings.interface";
import { UpdateScheduleMeetingDto } from "./dto/update-schedule-meeting.dto";


@EntityRepository(ScheduleMeetingEntity)
export class ScheduleMeetingRepository extends Repository<ScheduleMeetingEntity> {

    async saveMeetingSchedule(payload: CreateScheduleMeetingDto) : Promise<ScheduleMeetingsRO> {
        const today = new Date();

        if(!payload.accountId) {
            throw new HttpException( `User ID is required`, HttpStatus.BAD_REQUEST);
        }

        if(today > payload.startDate) {
            throw new HttpException( `Meeting Start Date${payload.startDate} cannot be less than current date`, HttpStatus.BAD_REQUEST);
        }

        const newMeetings = plainToClass(ScheduleMeetingEntity, payload);
        const errors = await validate(newMeetings);

        if(errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        return await this.save(newMeetings);

    }

    async getAllMeetingsSchedules({search}: FilterDto): Promise<ScheduleMeetingsRO[]> {
        if(search) {
            const meetings = await this.find({ 
                where: [
                    { topic: Like(`%${search} #%`) },
                    { meetingID: Like(`%${search} #%`)}
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
        if (meeting) {
            const updated = plainToClassFromExist(meeting, payload);
            return await this.save(updated);
        }

        throw new HttpException('Assailant',  HttpStatus.NOT_FOUND);
    }

   

}