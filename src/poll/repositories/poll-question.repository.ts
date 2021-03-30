import { HttpException, HttpStatus } from '@nestjs/common';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { NotEquals, validate } from 'class-validator';
import { AccountEntity } from 'src/account/entities/account.entity';
import { Repository, EntityRepository, DeleteResult, ILike, MoreThan } from 'typeorm';
import { CreatePollQuestionDto } from '../dto/create-poll-question.dto';
import { UpdatePollQuestionDto } from '../dto/update-poll-question.dto';
import { PollQuestionEntity } from '../entities/poll-question.entity';


@EntityRepository(PollQuestionEntity)
export class PollQuestionRepository extends Repository<PollQuestionEntity> {
  async createEntity(dto: CreatePollQuestionDto, user: AccountEntity): Promise<PollQuestionEntity> {

    if (dto && !dto.pollId) {
      throw new HttpException(
        `Question does not belong to any poll`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const question = plainToClass(PollQuestionEntity, dto);

    question.createdBy = user.email;
    const errors = await validate(question);

    if(errors.length > 0) {
        throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    try {        
        return await this.save(question);
    } catch(error)  {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateEntity(id: string,dto: UpdatePollQuestionDto, user: AccountEntity ): Promise<PollQuestionEntity> {
    if (!id) {
        throw new HttpException(`Invalid question`, HttpStatus.BAD_REQUEST);
    }
    const existingPollQuestion = await this.findOne(id, {where: {pollId: dto.pollId, content: dto.content, id: NotEquals(dto.id)}});

    if (existingPollQuestion) {
        throw new HttpException(
            `You have an active question with same content already exist`,
            HttpStatus.BAD_REQUEST,
          );
    }

    existingPollQuestion.updatedAt = new Date();
    existingPollQuestion.updatedBy = user.email;
    const updatePollQuestion = plainToClassFromExist(existingPollQuestion, dto);

    try {
         return await this.save(updatePollQuestion);
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deactivate(id: string, user: AccountEntity): Promise<PollQuestionEntity> {

    if (!id) {
        throw new HttpException(`Invalid question`, HttpStatus.BAD_REQUEST);
    }

    const existingPollQuestion = await this.findOne(id);
    if (!existingPollQuestion) {
        throw new HttpException(`PollQuestion does not exist`, HttpStatus.NOT_FOUND );
    }

    existingPollQuestion.active = false;
    return await existingPollQuestion.save();
  }


  async deleteEntity(id: string): Promise<DeleteResult> {
    if (!id) {
      throw new HttpException(`Invalid question`, HttpStatus.BAD_REQUEST);
    }

    const existingPollQuestion = await this.findOne(id);
    if (!existingPollQuestion) {
      throw new HttpException(`PollQuestion does not exist`, HttpStatus.NOT_FOUND);
    }
  
    return await this.delete({ id: existingPollQuestion.id });
  }

  async findById(id: string): Promise<PollQuestionEntity> {
    if (!id) {
      throw new HttpException(`Invalid question`, HttpStatus.BAD_REQUEST);
    }

    const existingPollQuestion = await this.findOne(id);
    if (!existingPollQuestion) {
      throw new HttpException(`PollQuestion does not exist`, HttpStatus.NOT_FOUND);
    }
    return existingPollQuestion;
  }


  async findAllQuestions(page = 1, searchParam: string): Promise<PollQuestionEntity[]> {  
    if (searchParam) {
      const param = `%${searchParam}%`
      const searchResult = await this.find({
        where: [
          { content: ILike(param) }
        ],
        order: { createdAt: 'ASC'},
        take: 25,
  
        skip: 25 * (page - 1),
      })

      return searchResult;
    }
    
    const PollQuestion = await this.find({
      order: { createdAt: 'ASC' },
      take: 25,

      skip: 25 * (page - 1),
    });

    return PollQuestion;
  }
}
