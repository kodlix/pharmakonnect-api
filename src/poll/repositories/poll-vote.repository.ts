import { HttpException, HttpStatus } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AccountEntity } from 'src/account/entities/account.entity';
import { Repository, EntityRepository, DeleteResult, ILike, getRepository } from 'typeorm';
import { CreatePollVoteDto } from '../dto/create-poll-vote.dto';
import { PollVoteEntity } from '../entities/poll-vote.entity';
import { PollEntity } from '../entities/poll.entity';
import { PollRepository } from './poll.repository';


@EntityRepository(PollVoteEntity)
export class PollVoteRepository extends Repository<PollVoteEntity> {
  constructor(private readonly  : PollRepository) {
    super();
  }
  async vote(dto: CreatePollVoteDto, user: AccountEntity): Promise<PollVoteEntity[]> {
    

    if (dto && !dto.pollId) {
      throw new HttpException(
        `Poll does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }


    if (dto && dto.pollOptions.find(x => x.questionId === undefined)) {
      throw new HttpException(
        `Question does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingPoll = await getRepository(PollEntity).createQueryBuilder('poll')
      .where(`poll.id =:pollId`, { pollId: dto.pollId })
      .getOne();

    if (!existingPoll) {
      throw new HttpException(
        `Poll does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (existingPoll.endDate < (new Date())) {
      throw new HttpException(
        `Sorry, poll is no longer open for participation.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (existingPoll.requiresLogin && !dto.accountId) {
      throw new HttpException(
        `You must login to participate.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const questionIds = dto.pollOptions.map(x => x.questionId);

    for (const questionId of questionIds) {
      const existingVote = await this.findOne({
        where: [
          { pollId: dto.pollId, questionId: questionId, email: dto.email },
          { pollId: dto.pollId, questionId: questionId, phoneNumber: dto.phoneNumber },
        ],
      });

      if (existingVote) {
        throw new HttpException(
          `You have already participated in this poll. Multiple submition not allowed`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

   
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    const newVotes: PollVoteEntity[] = [];
    for (const option of dto.pollOptions) {
      let newVote: any = {};

      newVote.pollId = dto.pollId;
      newVote.pollType = dto.pollType;      
      newVote.createdBy = (dto.email || dto.phoneNumber) || dto && dto.email || 'administrator@netopconsult.com';
      newVote.email = dto && dto.email || null;
      newVote.optionId = option.optionId;
      newVote.questionId = option.questionId;
      newVote.content = option.content;
      newVote.content = option.content;
      newVote.accountId = dto && dto.accountId || null;
      newVote.questionType = option.questionType;

      newVotes.push(newVote);
    }

    try {
      return await this.save(newVotes);
    } catch (error) {
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
        order: { createdAt: 'ASC' },
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
