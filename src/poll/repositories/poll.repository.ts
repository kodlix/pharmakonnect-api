import { HttpException, HttpStatus } from '@nestjs/common';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { NotEquals, validate } from 'class-validator';
import { AccountEntity } from 'src/account/entities/account.entity';
import { Repository, EntityRepository, DeleteResult, ILike, getRepository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { CreatePollDto } from '../dto/create-poll.dto';
import { UpdatePollDto } from '../dto/update-poll.dto';
import { PollEntity } from '../entities/poll.entity';
import { v4 as uuidv4 } from 'uuid';
import { PollSummaryDto } from '../dto/poll-summary.dto';
import { accountTypes } from 'src/account/account.constant';
import { isNotValidDate } from 'src/_utility/date-validator.util';
import { isNotValidTime } from 'src/_utility/time-validator.util';


@EntityRepository(PollEntity)
export class PollRepository extends Repository<PollEntity> {

  constructor() {
    super();
  }


  async createEntity(dto: CreatePollDto, user: AccountEntity): Promise<PollEntity> {
    const existingPoll = await this.findOne({
      where: { title: dto.title, accountId: user.id }
    });

    const owner = await getRepository(AccountEntity).findOne({ where: { id: user.id } });
    if (!owner) {
      throw new HttpException(`Invalid user.`, HttpStatus.BAD_REQUEST);
    }

    const today = new Date();

    if (new Date(dto.endDate).setHours(0, 0, 0, 0) < new Date(dto.startDate).setHours(0, 0, 0, 0)) {
      throw new HttpException(`Start date of poll cannot be greater than End date`, HttpStatus.BAD_REQUEST,);
    }

    if (isNotValidDate(dto.startDate)) {
      throw new HttpException(`Poll Start Date cannot be less than current date`, HttpStatus.BAD_REQUEST);
    }

    if (isNotValidTime(dto.startTime, dto.startDate)) {
      throw new HttpException(`Poll Start Time cannot be in the past.`, HttpStatus.BAD_REQUEST);
    }

    if (dto.startTime > dto.endTime ) {
      throw new HttpException(`Poll Start Time cannot be greater than End time.`, HttpStatus.BAD_REQUEST);
    }

    if (existingPoll && existingPoll.endDate >= today) {
      throw new HttpException(
        `You have an active poll with same title '${dto.title}'.`,
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

    if (existingPoll) {
      throw new HttpException(
        `You have an active poll with same title '${dto.title}' already exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const pollId = uuidv4().toString();
    const poll = plainToClass(PollEntity, dto);
    poll.id = pollId;
    poll.accountId = user.id;
    poll.createdBy = user.email;
    poll.createdAt = new Date()
    poll.owner = owner.accountType == accountTypes.INDIVIDUAL ? (owner.firstName + ' ' + owner.lastName) : owner.organizationName;
    if (poll.questions?.length > 0) {
      for (const [index, question] of poll.questions.entries()) {
        question.id = uuidv4();
        question.createdBy = user.email;
        question.createdAt = new Date()
        question.pollId = pollId;
        question.pollType = poll.type;
        question.SN = index + 1;

        if (question.options?.length > 0) {
          for (const option of question.options) {
            option.id = uuidv4();
            option.questionId = question.id;
            option.createdBy = user.email;
            option.createdAt = new Date()
            option.pollId = pollId;
            option.questionType = question.questionType
          }
        }
      }
    }

    const errors = await validate(poll);

    if (errors.length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    try {
      poll.endDate = dto.endDate;
      return await this.save(poll);
    } catch (error) {
      console.log(error);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateEntity(id: string, dto: UpdatePollDto, user: AccountEntity): Promise<PollEntity> {

    if (!id) {
      throw new HttpException(`Invalid poll`, HttpStatus.BAD_REQUEST);
    }
    const existingPoll = await this.findOne(id, { where: { title: dto.title, id: NotEquals(dto.id) } });

    const today = new Date();
    if (existingPoll) {
      throw new HttpException(
        `You have an active poll with same title '${dto.title}' already exist`,
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
      throw new HttpException(`Poll does not exist`, HttpStatus.NOT_FOUND);
    }

    existingPoll.published = true;
    existingPoll.publishedAt = new Date();
    existingPoll.publishedBy = user.email;
    existingPoll.active = true;

    return await existingPoll.save();
  }

  async reject(id: string, message: string, user: AccountEntity): Promise<PollEntity> {

    if (!id) {
      throw new HttpException(`Invalid poll`, HttpStatus.BAD_REQUEST);
    }

    if (!message) {
      throw new HttpException(`Rejection message is required.`, HttpStatus.BAD_REQUEST);
    }

    const existingPoll = await this.findOne(id);
    if (!existingPoll) {
      throw new HttpException(`Poll does not exist`, HttpStatus.NOT_FOUND);
    }

    existingPoll.published = false;
    existingPoll.rejected = true;
    existingPoll.publishedAt = null;
    existingPoll.publishedBy = null;
    existingPoll.updatedAt = new Date();
    existingPoll.updatedBy = user?.email;
    existingPoll.active = false;

    return await existingPoll.save();
  }

  async deactivate(id: string, user: AccountEntity): Promise<PollEntity> {

    if (!id) {
      throw new HttpException(`Invalid poll`, HttpStatus.BAD_REQUEST);
    }

    const existingPoll = await this.findOne({ id, accountId: user.id });
    if (!existingPoll) {
      throw new HttpException(`Poll does not exist`, HttpStatus.NOT_FOUND);
    }

    existingPoll.active = false;
    existingPoll.updatedBy = user.email;
    existingPoll.updatedAt = new Date();
    return await existingPoll.save();
  }


  async deleteEntity(id: string): Promise<DeleteResult | any> {
    if (!id) {
      throw new HttpException(`Invalid poll`, HttpStatus.BAD_REQUEST);
    }

    const existingPoll = await this.findOne(id);
    if (!existingPoll) {
      throw new HttpException(`Poll does not exist`, HttpStatus.NOT_FOUND);
    }

    if (existingPoll.published == true) {
      throw new HttpException(`Poll Event has been published and therefore cannot be deleted`, HttpStatus.NOT_FOUND);
    }

    // await this.pollVoteRepo.delete({pollId: existingPoll.id});
    // await this.pollOptionRepo.delete({pollId: existingPoll.id});
    // await  this.pollQuestionRepo.delete({pollId: existingPoll.id});
    return await this.remove(existingPoll);
  }

  async findById(id: string): Promise<PollEntity> {
    if (!id) {
      throw new HttpException(`Invalid poll`, HttpStatus.BAD_REQUEST);
    }

    const existingPoll = await this.findOne(id, { relations: ['questions', 'questions.options'] });
    if (!existingPoll) {
      throw new HttpException(`Poll does not exist`, HttpStatus.NOT_FOUND);
    }

    const pollOwner = await getRepository(AccountEntity).createQueryBuilder('acc')
      .where(`acc.id =:accountId`, { accountId: existingPoll.accountId })
      .getOne();

    if (!pollOwner) {
      throw new HttpException(`Poll has no valid owner.`, HttpStatus.NOT_FOUND);
    }
    existingPoll.owner = pollOwner?.firstName + " " + pollOwner?.lastName;
    return existingPoll;
  }


  async findAllPolls(page = 1, searchParam: string): Promise<PollEntity[]> {  // @TODO convert to full-text search
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
        order: { createdAt: 'DESC', published: 'DESC' },
        take: 25,

        skip: 25 * (page - 1),
      })

      return searchResult;
    }

    const Poll = await this.find({
      order: { createdAt: 'DESC', published: 'DESC' },
      take: 25,

      skip: 25 * (page - 1),
    });

    return Poll;
  }

  async findPublished(page: number, searchParam: string): Promise<PollEntity[]> {
    if (searchParam) {
      const param = `%${searchParam}%`
      const searchResult = await this.find({
        where: [
          { title: ILike(param), published: true, active: true },
          { slug: ILike(param), published: true, active: true },
          { hint: ILike(param), published: true, active: true },
          { type: ILike(param), published: true, active: true },
          { createdBy: ILike(param), published: true, active: true },
          { description: ILike(param), published: true, active: true },
        ],
        order: { createdAt: 'DESC', published: 'DESC' },
        take: 25,

        skip: 25 * (page - 1),
      })

      return searchResult;
    }

    const polls = await this.find({
      where: { published: true, active: true, startDate: LessThanOrEqual(new Date()), endDate: MoreThanOrEqual(new Date()) },
      order: { createdAt: 'DESC', published: 'DESC' },
      take: 25,

      skip: 25 * (page - 1),
    });

    return polls;
  }


  async findAllPollsByAccount(page = 1, searchParam: string, user: AccountEntity): Promise<PollEntity[]> {  // @TODO convert to full-text search
    if (searchParam) {
      const param = `%${searchParam}%`
      const searchResult = await this.find({
        where:
          [
            { title: ILike(param), accountId: user.id },
            { slug: ILike(param), accountId: user.id },
            { hint: ILike(param), accountId: user.id },
            { type: ILike(param), accountId: user.id },
            { createdBy: ILike(param), accountId: user.id },
            { description: ILike(param), accountId: user.id },
          ],
        order: { createdAt: 'DESC', published: 'DESC' },
        take: 25,

        skip: 25 * (page - 1),
      })

      return searchResult;
    }

    const Poll = await this.find({
      where: { accountId: user.id },
      order: { createdAt: 'DESC', published: 'DESC' },
      take: 25,

      skip: 25 * (page - 1),
    });

    return Poll;
  }

  async getPollSummary(id: string): Promise<PollSummaryDto> {
    if (!id) {
      throw new HttpException(`Invalid poll`, HttpStatus.BAD_REQUEST);
    }

    const existingPoll = await this.findOne(id, { relations: ['questions', 'questions.options', 'votes'] });
    if (!existingPoll) {
      throw new HttpException(`Poll does not exist`, HttpStatus.NOT_FOUND);
    }

    const pollSummaryDto = plainToClass(PollSummaryDto, existingPoll);
    const votes = pollSummaryDto.votes;

    pollSummaryDto.questions.forEach(q => {
      for (const option of q.options) {
        const count = votes.filter(x => x.optionId === option.id)?.length;
        option.optionCount = count;
        option.active = true;
      }
    })

    pollSummaryDto.totalVotes = votes?.length;

    return pollSummaryDto;
  }
}
