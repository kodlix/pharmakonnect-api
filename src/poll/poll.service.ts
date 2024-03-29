import { Injectable } from '@nestjs/common';
import { AccountEntity } from 'src/account/entities/account.entity';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { pollQuestionType, pollTypes } from './poll.constant';
import { PollRepository } from './repositories/poll.repository';

@Injectable()
export class PollService {
  /**
   * poll servcie 
   */
  constructor(private readonly pollRepository: PollRepository) {}
  async create(createPollDto: CreatePollDto, user :AccountEntity) {
    return await  this.pollRepository.createEntity(createPollDto, user);
  }

  async findAll(pageNo : number, searchParam: string) {
    return await  this.pollRepository.findAllPolls(pageNo, searchParam);
  }

  async findAllByOwner(pageNo : number, searchParam: string, user: AccountEntity) {
    return await  this.pollRepository.findAllPollsByAccount(pageNo, searchParam, user);
  }

  async findOne(id: string) {
    return await  this.pollRepository.findById(id);
  }

  async getPollSettings() {
    return await  {
      pollTypes:  this.convertEnumToArray(pollTypes),
      questionTypes: this.convertEnumToArray(pollQuestionType)
    }
  }

  async update(id: string, updatePollDto: UpdatePollDto, user :AccountEntity) {
    return await  this.pollRepository.updateEntity(id, updatePollDto, user);
  }

  async remove(id: string) {
    return await  this.pollRepository.deleteEntity(id);
  }

  private convertEnumToArray (enumEntity) {
    const result = Object.keys(enumEntity).map(el => {
      return {
        name: el,
        value: enumEntity[el]
      }
    })

    return result;   
    
  }
}
