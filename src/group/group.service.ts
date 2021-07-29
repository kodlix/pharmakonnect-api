/* eslint-disable prettier/prettier */
import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { AccountEntity } from 'src/account/entities/account.entity';
import { getRepository, Repository, getConnection } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupEntity } from './entities/group.entity';
import { CreateGroupContactDto } from './dto/create-group-contact.dto';
import { GroupMemberEntity } from './entities/group-member.entity';
import { GroupMemeberView } from './entities/group-member.view';
import { getManager } from 'typeorm';
import { GroupView } from './entities/group.view';
import { GroupDto, MemberDto } from './dto/group-view.dto';
import { plainToClass } from 'class-transformer';

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
      .values({ logo: dto.logo, name: dto.name, createdBy: user.createdBy, description: dto.description, ownerId: user.id })
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
        throw new BadRequestException(`Contact '${contact.firstName} ${contact.lastName}' already exists in this group.`);
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
      throw new BadRequestException(`Group '${exists.name}' already exists.`);
    }

    await getRepository(GroupEntity).createQueryBuilder()
      .update(GroupEntity)
      .set({ name: dto.name, description: dto.description, logo: dto.logo })
      .where("id = :id", { id })
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

  async findAll(page = 1, take = 50, user: any): Promise<any[]> {

    page = +page;
    take = take && +take || 50;

    const entityManager = getManager();
    const groups = await entityManager.find(GroupView, {
      where: { ownerId: user.id }, skip: take * (page - 1), take: take
    });
    return groups;
  }

  async findGroupContacts(groupId: string, page: number, take: number, user: any): Promise<GroupMemeberView[]> {
    page = +page;
    take = take && +take || 20;

    const entityManager = getManager();

    const contacts = await entityManager.find(GroupMemeberView, {
      where: { ownerId: user.id }, skip: take * (page - 1), take: take
    });
    return contacts;
  }

  async getGroupbyId(id: string) {
    const group = await getRepository(GroupEntity).findOne({ where: { id: id } });

    const entityManager = getManager();
    const groups = await entityManager.find(GroupMemeberView, {
      where: { groupId: id }
    });
    return {
      name: group.name,
      description: group.description,
      logo: group.logo,

      createdAt: group.createdAt,
      members: groups
    };
  }

  async getGroupByOwner(user: any) {
    const entityManager = getManager();
    const groups = await entityManager.find(GroupMemeberView, {
      where: { ownerId: user.id }
    });

    let allGroups: GroupDto[] = [];
    for (let index = 0; index < groups.length; index++) {
      let groupItem: GroupDto = null;
      // let memberItem: MemberDto;
      // let members: MemberDto[];

      const group = groups[index];
      const exists = allGroups?.find(x => x.groupId === group.groupId);

      if (exists) {
        continue;
      }

      const selectedMembers = groups.filter(x => x.groupId === group.groupId);
      groupItem = plainToClass(GroupDto, group, {excludeExtraneousValues: true});
      groupItem.members = plainToClass(MemberDto, selectedMembers, {excludeExtraneousValues: true});

      allGroups.push(groupItem);
    }

    return allGroups;
  }


  async removebyId(id: string, owner: any): Promise<boolean> {
    await getConnection().createQueryBuilder().delete().from(GroupMemberEntity)
      .where("groupId = :id AND ownerId =:ownerId", { id, ownerId: owner.id }).execute();

    await getConnection().createQueryBuilder().delete().from(GroupEntity)
      .where("id = :id AND ownerId =:ownerId", { id, ownerId: owner.id }).execute();
    return true;

  }

  async removeGoupMemberId(id: string, groupId: string, user: any): Promise<boolean> {
    await getConnection().createQueryBuilder().delete().from(GroupMemberEntity)
      .where("contactId =:id AND ownerId =:ownerId AND groupId =:groupId",
        { id, groupId, ownerId: user.id }).execute()

    return true;
  }
}
