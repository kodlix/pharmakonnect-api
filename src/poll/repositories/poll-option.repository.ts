import { HttpException, HttpStatus } from '@nestjs/common';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { NotEquals, validate } from 'class-validator';
import { AccountEntity } from 'src/account/entities/account.entity';
import { Repository, EntityRepository, DeleteResult, ILike, MoreThan } from 'typeorm';
import { CreatePollOptionDto } from '../dto/create-poll-option.dto';
import { UpdatePollOptionDto } from '../dto/update-poll-option.dto';
import { PollOptionEntity } from '../entities/poll-option.entity';


@EntityRepository(PollOptionEntity)
export class PollOptionRepository extends Repository<PollOptionEntity> {
  async createEntity(dto: CreatePollOptionDto, user: AccountEntity): Promise<PollOptionEntity> {

    if (dto && !dto.pollId) {
      throw new HttpException(
        `Option does not belong to any poll`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const option = plainToClass(PollOptionEntity, dto);

    option.createdBy = user.email;
    const errors = await validate(option);

    if(errors.length > 0) {
        throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    try {        
        return await this.save(option);
    } catch(error)  {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateEntity(id: string,dto: UpdatePollOptionDto, user: AccountEntity ): Promise<PollOptionEntity> {
    if (!id) {
        throw new HttpException(`Invalid option`, HttpStatus.BAD_REQUEST);
    }
    const existingPollOption = await this.findOne(id, {where: {pollId: dto.pollId, questionId: dto.questionId,content: dto.content, id: NotEquals(dto.id)}});

    if (existingPollOption) {
        throw new HttpException(
            `An option with same content already exist`,
            HttpStatus.BAD_REQUEST,
          );
    }

    existingPollOption.updatedAt = new Date();
    existingPollOption.updatedBy = user.email;
    const updatePollOption = plainToClassFromExist(existingPollOption, dto);

    try {
         return await this.save(updatePollOption);
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deactivate(id: string, user: AccountEntity): Promise<PollOptionEntity> {

    if (!id) {
        throw new HttpException(`Invalid option`, HttpStatus.BAD_REQUEST);
    }

    const existingPollOption = await this.findOne(id);
    if (!existingPollOption) {
        throw new HttpException(`Poll Option you want to deactivate does not exist`, HttpStatus.NOT_FOUND );
    }
    existingPollOption.active = false;
    return await existingPollOption.save();
  }


  async deleteEntity(id: string): Promise<DeleteResult> {
    if (!id) {
      throw new HttpException(`Invalid option`, HttpStatus.BAD_REQUEST);
    }

    const existingPollOption = await this.findOne(id);
    if (!existingPollOption) {
      throw new HttpException(`PollOption does not exist`, HttpStatus.NOT_FOUND);
    }
  
    return await this.delete({ id: existingPollOption.id });
  }

  async findById(id: string): Promise<PollOptionEntity> {
    if (!id) {
      throw new HttpException(`Invalid option`, HttpStatus.BAD_REQUEST);
    }

    const existingPollOption = await this.findOne(id);
    if (!existingPollOption) {
      throw new HttpException(`PollOption does not exist`, HttpStatus.NOT_FOUND);
    }
    return existingPollOption;
  }


  async findAllOptions(page = 1, searchParam: string): Promise<PollOptionEntity[]> {  
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
    
    const PollOption = await this.find({
      order: { createdAt: 'ASC' },
      take: 25,

      skip: 25 * (page - 1),
    });

    return PollOption;
  }
}
