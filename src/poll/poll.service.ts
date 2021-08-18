import { Injectable } from '@nestjs/common';
import { AccountEntity } from 'src/account/entities/account.entity';
import { CreatePollVoteDto } from './dto/create-poll-vote.dto';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { pollQuestionType, pollTypes } from './poll.constant';
import { PollVoteRepository } from './repositories/poll-vote.repository';
import { PollRepository } from './repositories/poll.repository';

@Injectable()
export class PollService {
 

  /**
   * poll servcie 
   */
  constructor(
    private readonly pollRepository: PollRepository,
    private readonly pollVoteRepository: PollVoteRepository
    ) {}
  async create(createPollDto: CreatePollDto, user :AccountEntity) {
    return await  this.pollRepository.createEntity(createPollDto, user);
  }

  async findAll(pageNo : number, searchParam: string) {
    return await  this.pollRepository.findAllPolls(pageNo, searchParam);
  }

  async findAllPublished(page: number, searchParam: string): Promise<any> {
    return await  this.pollRepository.findPublished(page, searchParam);
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

  async getPollSummary(id) {
    return await this.pollRepository.getPollSummary(id);
  }

  async update(id: string, updatePollDto: UpdatePollDto, user :AccountEntity) {
    return await  this.pollRepository.updateEntity(id, updatePollDto, user);
  }

  async publish(id: string, user :AccountEntity) {
    return await  this.pollRepository.publish(id, user);
  }

  async deactivate(id: string, user :AccountEntity) {
    return await  this.pollRepository.deactivate(id, user);
  }

  async reject(id: string,  message: string, user: any) {
    return await  this.pollRepository.reject(id, message, user);
  }

  async remove(id: string) {
    return await  this.pollRepository.deleteEntity(id);
  }

  async vote(dto: CreatePollVoteDto, user :AccountEntity) {
    return await  this.pollVoteRepository.vote(dto, user);
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
