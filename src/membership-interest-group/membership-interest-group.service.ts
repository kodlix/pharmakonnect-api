import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeleteResult, Repository} from "typeorm";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { AccountEntity } from "src/account/entities/account.entity";
import { MembershipInterestGroupEntity } from "./entities/membership-interest-group.entity";
import { CreateMembershipInterestGroupDto } from "./dto/create-membership-interest-group.dto";
import { MembershipInterestGroupRO } from "./interfaces/membership-interest-group.interface";
import { UpdateMembershipInterestGroupDto } from "./dto/update-membership-interest-group.dto";
import { InjectRepository } from "@nestjs/typeorm";



@Injectable()
export class MembershipInterestGroupService {
    constructor(
        @InjectRepository(MembershipInterestGroupEntity)
        private readonly zoneRepository: Repository<MembershipInterestGroupEntity>
      ) { }

    async createEntity(payload: CreateMembershipInterestGroupDto, user: AccountEntity) : Promise<string> {

        const isMembershipInterestGroupExist = await this.zoneRepository.findOne({where: {name: payload.name}});
        if(isMembershipInterestGroupExist) {
            throw new HttpException( `Membership of interest group with ${payload.name} already exist`, HttpStatus.BAD_REQUEST);
        }

        const newMembershipInterestGroup = plainToClass(MembershipInterestGroupEntity, payload);
        newMembershipInterestGroup.createdBy = user.createdBy;        

        const errors = await validate(newMembershipInterestGroup);

        if(errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        try {
             await this.zoneRepository.save(newMembershipInterestGroup);
             return "Membership of interest group successfully saved";
        } catch(error)  {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getAll(): Promise<MembershipInterestGroupRO[]> {
        
        return await this.zoneRepository.find();
    }

    async findById(id: string): Promise<MembershipInterestGroupRO> {

        const membershipInterestGroup = await this.zoneRepository.findOne(id);
        if(membershipInterestGroup) {
            return membershipInterestGroup;
        }
        throw new HttpException(`The membership of interest group cannot be found`, HttpStatus.NOT_FOUND);

    }
    
    async delete(id: string): Promise<DeleteResult> {

        const membershipInterestGroup = await this.zoneRepository.findOne(id);
        if(membershipInterestGroup) {
            return await this.zoneRepository.delete(membershipInterestGroup.id);
        }

        throw new HttpException(`The membership of interest group cannot be found`, HttpStatus.NOT_FOUND);

    }

    async updateEntity(id: string, payload: UpdateMembershipInterestGroupDto, user: AccountEntity) : Promise<string> {
        const membershipInterestGroup = await this.zoneRepository.findOne(id);
        if (membershipInterestGroup ) {

            if( membershipInterestGroup.name != payload.name) {
                
                const nameExist = await this.zoneRepository.findOne({where: {name: payload.name}});
                if(nameExist){
                    throw new HttpException( `Membership of interest group with ${payload.name} is already in use`, HttpStatus.BAD_REQUEST);
                }
            }
         

            membershipInterestGroup.updatedAt = new Date();
            membershipInterestGroup.updatedBy = user.updatedBy || user.createdBy;

            const updated = plainToClassFromExist(membershipInterestGroup, payload);

            try {
                 await this.zoneRepository.save(updated);
                 return "Membership of interest group successfully updated";
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        throw new HttpException(`The membership of interest group cannot be found`, HttpStatus.NOT_FOUND);
    }

}