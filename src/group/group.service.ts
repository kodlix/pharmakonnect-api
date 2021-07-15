import { BadRequestException } from '@nestjs/common';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountEntity } from 'src/account/entities/account.entity';
import { getRepository, Repository, getConnection } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupEntity } from './entities/group.entity';

@Injectable()
export class GroupService extends Repository<GroupEntity> {

  async createGroup(dto: CreateGroupDto, user: AccountEntity): Promise<any> {
    const exists = await  getRepository(GroupEntity).createQueryBuilder('g')
    .where('g.name =:name AND g.ownerId =:owner', {name: dto.name, owner: user.id})
    .getOne();

    if(exists){
      throw new BadRequestException(`Group ${name} already exists.`);
    }

    return await getRepository(GroupEntity).createQueryBuilder('g')
   .insert()
   .into(GroupEntity)
   .values({name: dto.name, description: dto.description, ownerId: user.id})
   .execute();
  }

  async editGroup(id: string, dto: UpdateGroupDto, user: AccountEntity): Promise<boolean> {
    const exists = await  getRepository(GroupEntity).createQueryBuilder('g')
    .where('g.name =:name AND g.ownerId =:owner AND id !=:id', {name: dto.name, owner: user.id, id})
    .getOne();

    if(exists){
      throw new BadRequestException(`Group ${name} already exists.`);
    }

    await getRepository(GroupEntity).createQueryBuilder()
    .update(GroupEntity)
    .set({ name: dto.name, description: dto.description })
    .where("id = :id", { id: dto.id })
    .execute();

    return true;
  }

  async findAllByAccount(page = 1, take = 20, user: any): Promise<GroupEntity[]> {

    page = +page;
    take = take && +take || 20;


    const [groups, total] = await getRepository(GroupEntity)
      .createQueryBuilder('g')
      .where('g.ownerId = :id', { id: user.id })
      .skip(take * (page - 1))
      .take(take)
      .getManyAndCount();
    return groups;
  }

  async findAll(page = 1, take = 20): Promise<GroupEntity[]> {

    page = +page;
    take = take && +take || 20;


    const [groups, total] = await getRepository(GroupEntity)
      .createQueryBuilder('g')
      .skip(take * (page - 1))
      .take(take)
      .getManyAndCount();
    return groups;
  }

  async getGroupbyId(id: string) {
    const contact = await getRepository(GroupEntity).findOne({ where: { id: id } });
    return contact
  }


  async removebyId(id: string) {
    const isDeleted = await getConnection().createQueryBuilder().delete().from(GroupEntity)
      .where("id = :id", { id }).execute();
    return isDeleted
  }
}
