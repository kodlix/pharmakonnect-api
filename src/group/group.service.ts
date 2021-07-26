/* eslint-disable prettier/prettier */
import { BadRequestException } from '@nestjs/common';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountEntity } from 'src/account/entities/account.entity';
import { getRepository, Repository, getConnection } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupEntity } from './entities/group.entity';
import { CreateGroupContactDto } from './dto/create-group-contact.dto';
import { GroupMemberEntity } from './entities/group-member.entity';

@Injectable()
export class GroupService extends Repository<GroupEntity> {

  async createGroup(dto: CreateGroupDto, user: AccountEntity): Promise<any> {
    const exists = await getRepository(GroupEntity).createQueryBuilder('g')
      .where('g.name =:name AND g.ownerId =:owner', { name: dto.name, owner: user.id })
      .getOne();

    if (exists) {
      throw new BadRequestException(`Group ${name} already exists.`);
    }

    return await getRepository(GroupEntity).createQueryBuilder('g')
      .insert()
      .into(GroupEntity)
      .values({ name: dto.name, description: dto.description, ownerId: user.id })
      .execute();
  }

  async createGroupContact(dto: CreateGroupContactDto): Promise<any> {
    const exists = await getRepository(GroupMemberEntity).createQueryBuilder('g')
    .where (' g.groupId =: group AND contactId =: contact')
    .getOne();

    if (exists) {
      throw new BadRequestException(`Contact ${dto.contactId} already exists in this group.`);
    }
    
    return await getRepository(GroupMemberEntity).createQueryBuilder('g')
    .insert()
    .into(GroupMemberEntity)
    .values({ownerId: dto.ownerId, groupId: dto.groupId, contactId: dto.contactId, })
    .execute();
  }

  async editGroup(id: string, dto: UpdateGroupDto, user: AccountEntity): Promise<boolean> {
    const exists = await getRepository(GroupEntity).createQueryBuilder('g')
      .where('g.name =:name AND g.ownerId =:owner AND id !=:id', { name: dto.name, owner: user.id, id })
      .getOne();

    if (exists) {
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

  async findGroupContacts(page = 1, take = 20): Promise<GroupMemberEntity[]> {
    page = +page;
    take = take && +take || 20;

    const [contacts, total] = await getRepository(GroupMemberEntity)
    .createQueryBuilder('g')
    .where('g.Id =: id AND g.groupId=: groupId AND g.ownerId =: ownerId')
    .skip(take * (page - 1))
    .take(take)
    .getManyAndCount();
    
  return contacts;

  }


  async findAllGroupMembers(groupId: string, owner: any, page = 1, take = 20): Promise<GroupEntity[]> {

    page = +page;
    take = take && +take || 20;


    const [groups, total] = await getRepository(GroupEntity)
      .createQueryBuilder('g')
      .leftJoinAndSelect("GroupMember", "gm", "gm.groupId = g.id")
      .leftJoinAndSelect("Account", "a", "a.id = g.ownerId")
      .where("g.id =:groupId AND g.ownerId =: ownerId", { groupId, ownerId: owner.id })
      .skip(take * (page - 1))
      .take(take)
      .getManyAndCount();
      
    return groups;
  }

  async getGroupbyId(id: string) {
    const contact = await getRepository(GroupEntity).findOne({ where: { id: id } });
    return contact
  }


  async removebyId(id: string, owner: any) {
    const isDeleted = await getConnection().createQueryBuilder().delete().from(GroupEntity)
      .where("id = :id AND owner =:ownerId", { id, ownerId: owner.id }).execute();
    return isDeleted
  }

  async removeGoupMemberId(id: string) {
    const isDeleted = await getConnection().createQueryBuilder().delete().from(GroupMemberEntity)
    .where("id =:id AND contact =: contactId", {id} )

    return isDeleted;
  }
}
