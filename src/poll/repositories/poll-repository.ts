import { HttpException, HttpStatus } from '@nestjs/common';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { NotEquals, validate } from 'class-validator';
import { AccountEntity } from 'src/account/entities/account.entity';
import { Repository, EntityRepository, DeleteResult, ILike, MoreThan } from 'typeorm';
import { CreatePollDto } from '../dto/create-poll.dto';
import { UpdatePollDto } from '../dto/update-poll.dto';
import { PollEntity } from '../entities/poll.entity';


@EntityRepository(PollEntity)
export class PollRepository extends Repository<PollEntity> {
  async createEntity(dto: CreatePollDto, user: AccountEntity): Promise<PollEntity> {
    const existingPoll = await this.findOne({ where: { title : dto.title, accountId: user.id, endDate:  MoreThan(new Date()), } });

    const today = new Date();    
    if (existingPoll) {
        throw new HttpException(
            `You have an active poll with same title '${dto.title}' already exisits`,
            HttpStatus.BAD_REQUEST,
          );
    }
   
    if (dto.endDate < today) {
      throw new HttpException(
        `Poll end-date cannot be less than today`,
        HttpStatus.BAD_REQUEST,
      );
    }
    
    if (dto.endDate < dto.startDate) {
      throw new HttpException(
        `Poll end-date cannot be greater than start-date`,
        HttpStatus.BAD_REQUEST,
      );
    } 

    const poll = plainToClass(PollEntity, dto);

    poll.accountId = user.id;
    poll.createdBy = user.email;

    const errors = await validate(poll);

    if(errors.length > 0) {
        throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    try {        
        return await this.save(poll);
    } catch(error)  {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateEntity(id: string,dto: UpdatePollDto, user: AccountEntity ): Promise<PollEntity> {

    if (!id) {
        throw new HttpException(`Invalid poll`, HttpStatus.BAD_REQUEST);
    }
    const existingPoll = await this.findOne(id, {where: {title: dto.title, id: NotEquals(dto.id)}});

    const today = new Date();    
    if (existingPoll) {
        throw new HttpException(
            `You have an active poll with same title '${dto.title}' already exisits`,
            HttpStatus.BAD_REQUEST,
          );
    }
   
    if (dto.endDate < today) {
      throw new HttpException(
        `Poll end-date cannot be less than today`,
        HttpStatus.BAD_REQUEST,
      );
    }
    
    if (dto.endDate < dto.startDate) {
      throw new HttpException(
        `Poll end-date cannot be greater than start-date`,
        HttpStatus.BAD_REQUEST,
      );
    } 

    existingPoll.updatedAt = new Date();
    existingPoll.updatedBy = user.email;
    const updatePoll = plainToClassFromExist(existingPoll, dto);

    try {
         return await this.save(updatePoll);
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async publish(id: string, user: AccountEntity): Promise<PollEntity> {

    if (!id) {
        throw new HttpException(`Invalid poll`, HttpStatus.BAD_REQUEST);
    }

    const existingPoll = await this.findOne(id);
    if (!existingPoll) {
        throw new HttpException(`Poll does not exisits`, HttpStatus.NOT_FOUND );
    }

    existingPoll.published = true;
    existingPoll.publishedAt = new Date();
    existingPoll.publishedBy = user.id;

    return await existingPoll.save();
  }


  async deleteEntity(id: string): Promise<DeleteResult> {
    if (!id) {
      throw new HttpException(`Invalid poll`, HttpStatus.BAD_REQUEST);
    }

    const existingPoll = await this.findOne(id);
    if (!existingPoll) {
      throw new HttpException(`Poll does not exisits`, HttpStatus.NOT_FOUND);
    }
  
    return await this.delete({ id: existingPoll.id });
  }

  async findById(id: string): Promise<PollEntity> {
    if (!id) {
      throw new HttpException(`Invalid poll`, HttpStatus.BAD_REQUEST);
    }

    const existingPoll = await this.findOne(id);
    if (!existingPoll) {
      throw new HttpException(`Poll does not exisits`, HttpStatus.NOT_FOUND);
    }
    return existingPoll;
  }


  async findJob(page = 1, searchParam: string): Promise<PollEntity[]> {
    if (searchParam) {
      const param = `%${searchParam}%`
      const searchResult = await this.find({
        where: [
          { title: ILike(param) },
          { slug: ILike(param) },
          { hint: ILike(param) },
          { type: ILike(param) },
          { createdBy: ILike(param) },
          { description: ILike(param) },
        ],
        order: { createdAt: 'ASC', published : 'ASC'},
        take: 25,
  
        skip: 25 * (page - 1),
      })

      return searchResult;
    }
    
    const Poll = await this.find({
      order: { createdAt: 'ASC' },
      take: 25,

      skip: 25 * (page - 1),
    });

    return Poll;
  }
}
