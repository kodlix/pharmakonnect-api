import { HttpException, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';
import { accountTypes } from 'src/account/account.constant';
import { AccountRepository } from 'src/account/account.repository';
import { AccountEntity } from 'src/account/entities/account.entity';
import { GroupRepository } from 'src/group/group-repository';
import { accessLevels } from 'src/_common/constants/access-level';
import { addTimeToDate } from 'src/_utility/formatter.util';
import { Repository, EntityRepository, DeleteResult, ILike, getRepository } from 'typeorm';
import { CreatePollVoteDto } from '../dto/create-poll-vote.dto';
import { PollVoteEntity } from '../entities/poll-vote.entity';
import { PollEntity } from '../entities/poll.entity';


@EntityRepository(PollVoteEntity)
export class PollVoteRepository extends Repository<PollVoteEntity> {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly accountRepository: AccountRepository
  ) {
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


    if (addTimeToDate(existingPoll.endDate, existingPoll.endTime) < (new Date())) {
      throw new HttpException(
        `Sorry, poll has expired and no longer open for participation.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (existingPoll.accessLevel === accessLevels.GROUP) {
      const userExistsInGroup = await this.groupRepository.memberExistsInGroup(existingPoll.group, dto.accountId);
      if (!userExistsInGroup) {
        throw new HttpException(
          `You are not permitted to participate in this ${existingPoll.type.toLowerCase()}.`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (existingPoll.accessLevel === accessLevels.PROFESSIONAL) {
      //check if the user is a professional
      // system generated device specific ids start with _ (stored as cookie on the client side)
      if (dto.accountId.startsWith('_')) {
        throw new HttpException(
          `This ${existingPoll.type.toLowerCase()} is available to professionals only.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.accountRepository.getById(dto.accountId);
      if (!user) {
        throw new HttpException(
          `You are not permitted to participate in this ${existingPoll.type.toLowerCase()}. Account does not exist.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (user.accountType !== accountTypes.PROFESSIONAL) {
        throw new HttpException(
          `This ${existingPoll.type.toLowerCase()} is available to professionals only.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const userExistsInGroup = await this.groupRepository.memberExistsInGroup(existingPoll.group, dto.accountId);
      if (!userExistsInGroup) {
        throw new HttpException(
          `You are not permitted to participate in this ${existingPoll.type.toLowerCase()}.`,
          HttpStatus.BAD_REQUEST,
        );
      }
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
          `You have already voted in this ${existingPoll.type}. Multiple submition not allowed`,
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
      newVote.createdBy = dto.accountId || 'admin@netopng.com';
      newVote.email = dto && dto.email || null;
      newVote.optionId = option.optionId;
      newVote.questionId = option.questionId;
      newVote.content = option.content;
      newVote.content = option.content;
      newVote.accountId = dto && dto.accountId;
      newVote.questionType = option.questionType;

      newVotes.push(newVote);
    }

    try {
      const votes =  await this.save(newVotes);
      return votes

      //@TODO: Consider saving the voter in polluser table
      //save the voted user
      //const pollUser = new PollUserEntity();
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
