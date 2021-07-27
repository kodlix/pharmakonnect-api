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
import { GroupMemeberView } from './entities/group.view';
import { getManager } from 'typeorm';

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
      .values({ name: dto.name, createdBy: user.createdBy, description: dto.description, ownerId: user.id })
      .execute();
  }

  async createGroupContact(dto: CreateGroupContactDto, user: any): Promise<any> {
    const groupMember = await getRepository(GroupMemberEntity).createQueryBuilder('g')
      .where(' g.groupId =:group AND g.contactId IN (:...members)', { group: dto.groupId, members: dto.members })
      .getOne();


    if (groupMember) {
      const contact = await getRepository(AccountEntity).createQueryBuilder('c')
        .where('c.id =:id', { id: groupMember.contactId })
        .getOne();

      if (contact) {
        throw new BadRequestException(`Contact '${contact.email}' already exists in this group.`);
      }
    }

    const groupMembers: any[] = [];
    for (const member of dto.members) {
      const groupMember = { groupId: dto.groupId, contactId: member, ownerId: user.id, createdBy: user.email };
      groupMembers.push(groupMember);
    }


    return await getRepository(GroupMemberEntity).createQueryBuilder('g')
      .insert()
      .into(GroupMemberEntity)
      .values(groupMembers)
      .execute();
    return;
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

  async findGroupContacts(groupId: string, page: number, take: number, user: any): Promise<GroupMemeberView[]> {
    page = +page;
    take = take && +take || 20;

    const entityManager = getManager();

    const contacts = await entityManager.find(GroupMemeberView, {
      where: { ownerId: user.id }, skip: take * (page - 1), take: take});
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
      .where("id =:id AND contact =: contactId", { id })

    return isDeleted;
  }
}
