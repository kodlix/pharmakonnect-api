import { HttpException, HttpStatus } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AccountEntity } from 'src/account/entities/account.entity';
import { Repository, EntityRepository, DeleteResult, ILike } from 'typeorm';
import { CreatePollVoteDto } from '../dto/create-poll-vote.dto';
import { PollVoteEntity } from '../entities/poll-vote.entity';
import { PollRepository } from './poll.repository';


@EntityRepository(PollVoteEntity)
export class PollVoteRepository extends Repository<PollVoteEntity> {
  constructor(private readonly pollRepository: PollRepository) {
    super();
  }
  async vote(dto: CreatePollVoteDto, user: AccountEntity): Promise<PollVoteEntity> {

    if (dto && !dto.pollId) {
      throw new HttpException(
        `Poll does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }


    if (dto && !dto.questionId) {
      throw new HttpException(
        `Question does not exist`,
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

    const existingVote = await this.findOne({
      where: [
        { pollId: dto.pollId, questionId: dto.questionId, email: dto.email },
        { pollId: dto.pollId, questionId: dto.questionId, phonenumber: dto.phonenumber },
      ],
    });

    if (existingVote) {
      throw new HttpException(
        `You have multiple vote not for this poll.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const pollVote = plainToClass(PollVoteEntity, dto);
    pollVote.createdBy =  (dto.email || dto.phonenumber ) || user && user.email || 'administrator@netopconsult.com';

    const errors = await validate(pollVote);
    if(errors.length > 0) {
        throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    try {        
        return await this.save(pollVote);
    } catch(error)  {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
  async deleteEntity(id: string): Promise<DeleteResult> {
    if (!id) {
      throw new HttpException(`Invalid poll Vote`, HttpStatus.BAD_REQUEST);
    }

    const existingPollVote = await this.findOne(id);
    if (!existingPollVote) {
      throw new HttpException(`poll not found`, HttpStatus.NOT_FOUND);
    }
  
    return await this.delete({ id: existingPollVote.id });
  }

  async findById(id: string): Promise<PollVoteEntity> {
    if (!id) {
      throw new HttpException(`Invalid poll Vote`, HttpStatus.BAD_REQUEST);
    }

    const existingPollVote = await this.findOne(id);
    if (!existingPollVote) {
      throw new HttpException(`Poll Vote does not exist`, HttpStatus.NOT_FOUND);
    }
    return existingPollVote;
  }


  async findAllVotes(page = 1, searchParam: string): Promise<PollVoteEntity[]> {  
    if (searchParam) {
      const param = `%${searchParam}%`
      const searchResult = await this.find({
        where: [
          { email: ILike(param) },
          { phonenumber: ILike(param) },
          { pollType: ILike(param) },
          { questionType: ILike(param) },          
        ],
        order: { createdAt: 'ASC'},
        take: 25,
  
        skip: 25 * (page - 1),
      })

      return searchResult;
    }
    
    const pollVotes = await this.find({
      order: { createdAt: 'ASC' },
      take: 25,

      skip: 25 * (page - 1),
    });

    return pollVotes;
  }
}
