import { HttpException, HttpStatus } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AccountEntity } from 'src/account/entities/account.entity';
import { Repository, EntityRepository, DeleteResult, ILike } from 'typeorm';
import { CreatePollUserDto } from '../dto/create-poll-user.dto';
import { PollUserEntity } from '../entities/poll-user.entity';
import { PollRepository } from './poll.repository';


@EntityRepository(PollUserEntity)
export class PollUserRepository extends Repository<PollUserEntity> {
  constructor(private readonly pollRepository: PollRepository) {
    super();
  }
  async register(dto: CreatePollUserDto, user: AccountEntity): Promise<PollUserEntity> {

    if (dto && !dto.pollId) {
      throw new HttpException(
        `Poll does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingPoll = await this.pollRepository.findById(dto.pollId);      
    if (!existingPoll) {
      throw new HttpException(
        `Poll does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (existingPoll.endDate < (new Date())) {
      throw new HttpException(
        `Sorry, poll is no longer open for registration.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingUser = await this.findOne({where:  [{ pollId: dto.pollId, email: dto.email},{pollId: dto.pollId, phonenumber: dto.phonumber}] })

    if (existingUser) {
      throw new HttpException(
        `You have already registered for this poll.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const pollUser = plainToClass(PollUserEntity, dto);
    pollUser.createdBy = user && user.email || 'administrator@netopconsult.com';
    const errors = await validate(pollUser);

    if(errors.length > 0) {
        throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    try {        
        return await this.save(pollUser);
    } catch(error)  {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deactivate(email: string): Promise<PollUserEntity> {

    if (!email) {
        throw new HttpException(`Invalid user`, HttpStatus.BAD_REQUEST);
    }

    const existingPollUser = await this.findOne({where: {email}});
    if (!existingPollUser) {
        throw new HttpException(`User does not exist`, HttpStatus.NOT_FOUND );
    }

    existingPollUser.active = false;
    return await existingPollUser.save();
  }


  async deleteEntity(id: string): Promise<DeleteResult> {
    if (!id) {
      throw new HttpException(`Invalid pollUser`, HttpStatus.BAD_REQUEST);
    }

    const existingPollUser = await this.findOne(id);
    if (!existingPollUser) {
      throw new HttpException(`PollUser does not exist`, HttpStatus.NOT_FOUND);
    }
  
    return await this.delete({ id: existingPollUser.id });
  }

  async findById(id: string): Promise<PollUserEntity> {
    if (!id) {
      throw new HttpException(`Invalid pollUser`, HttpStatus.BAD_REQUEST);
    }

    const existingPollUser = await this.findOne(id);
    if (!existingPollUser) {
      throw new HttpException(`PollUser does not exist`, HttpStatus.NOT_FOUND);
    }
    return existingPollUser;
  }


  async findAllUsers(page = 1, searchParam: string): Promise<PollUserEntity[]> {  
    if (searchParam) {
      const param = `%${searchParam}%`
      const searchResult = await this.find({
        where: [
          { email: ILike(param) },
          { phonenumber: ILike(param) },
        ],
        order: { createdAt: 'ASC'},
        take: 25,
  
        skip: 25 * (page - 1),
      })

      return searchResult;
    }
    
    const pollUsers = await this.find({
      order: { createdAt: 'ASC' },
      take: 25,

      skip: 25 * (page - 1),
    });

    return pollUsers;
  }
}
