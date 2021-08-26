/* eslint-disable prettier/prettier */
import { BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { AccountEntity } from 'src/account/entities/account.entity';
import { getRepository, Repository, getConnection, InsertResult } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupEntity } from './entities/group.entity';
import { CreateGroupContactDto, CreateNewGroupAndContactDto } from './dto/create-group-contact.dto';
import { GroupMemberEntity } from './entities/group-member.entity';
import { GroupMemeberView } from './entities/group-member.view';
import { getManager } from 'typeorm';
import { GroupView } from './entities/group.view';
import { GroupDto, MemberDto } from './dto/group-view.dto';
import { plainToClass } from 'class-transformer';
import { ConversationEntity } from 'src/chat/entities/conversation.entity';
import { ParticipantEntity } from 'src/chat/entities/participant.entity';
import { ContactService } from 'src/contact/contact.service';
import { CreateContactDto } from 'src/contact/dto/create-contact.dto';

@Injectable()
export class GroupService extends Repository<GroupEntity> {
  constructor(
    @Inject(forwardRef(() => ContactService)) private readonly contactServcie: ContactService) 
    {
    super();    
  }

  async createGroup(dto: CreateGroupDto, user: AccountEntity): Promise<InsertResult> {
    const exists = await getRepository(GroupEntity).createQueryBuilder('g')
      .where('g.name =:name AND g.ownerId =:owner', { name: dto.name, owner: user.id })
      .getOne();

    if (exists) {
      throw new BadRequestException(`Group ${name} already exists.`);
    }

    const result = await getRepository(GroupEntity).createQueryBuilder('g')
      .insert()
      .into(GroupEntity)
      .values({ logo: dto.logo, name: dto.name, createdBy: user.createdBy, description: dto.description, ownerName: user.firstName ? `${user.firstName} ${user.lastName}` : user.organizationName, ownerId: user.id })
      .execute();

    // save group creator as the first group member
    if (result.raw[0].id) {
      const groupMember = { groupId: result.raw[0].id, contactId: user.id, ownerId: user.id, createdBy: user.email };

      await getRepository(GroupMemberEntity).createQueryBuilder('g')
        .insert()
        .into(GroupMemberEntity)
        .values(groupMember)
        .execute();
    }

    return result;
  }

  async createGroupWithContact(dto: CreateNewGroupAndContactDto, user: AccountEntity): Promise<boolean> {
    // @TODO: make this process a transaction

    const members = dto?.members;
    if(members.length === 0){
      throw new BadRequestException("No members to create");
    }

    const groupDto = new CreateGroupDto();
    groupDto.name = dto.name;
    groupDto.description = dto.description;

    //create a new group
    const result = await this.createGroup(groupDto, user);

    if (!result) {
      throw new BadRequestException("Unable to create group");
    }

    //add group to members
    const groupId = result.raw[0].id;
    if (groupId) {
      const groupContacts = new CreateGroupContactDto();
      groupContacts.groupId = groupId;
      groupContacts.members = dto.members;
      await this.createGroupContact(groupContacts, user);
    }

    // add group members to owner's contacts
    //await this.addMembersToOwnerContact(members, user);
    return true;
  }

  private async addMembersToOwnerContact(members: string[], user: AccountEntity) {
    const users = await getRepository(AccountEntity).createQueryBuilder('acc')
      .where('acc.id IN (:...members)', { members })
      .getMany();

    if (users.length > 0) {
      const newContacts: CreateContactDto[] = [];
      const newContact = new CreateContactDto();

      for (const item of users) {
        newContact.accountId = item.id;
        newContact.creatorId = user.id;
        newContact.email = item.email;
        newContact.phoneNumber = item.phoneNumber;
        newContact.firstName = item.firstName;
        newContact.lastName = item.lastName;

        newContacts.push(newContact);
      }
      const contacts = await this.contactServcie.createContact(newContacts, user);
      return contacts;
    }
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

    
    // if (dto.addMembersToContact) {
    //   await this.addMembersToOwnerContact(dto.members, user);
    // }

    const groupMembers: any[] = [];
    for (const member of dto.members) {
      const groupMember = { groupId: dto.groupId, contactId: member, ownerId: user.id, createdBy: user.email };
      groupMembers.push(groupMember);
    }

    const result = await getRepository(GroupMemberEntity).createQueryBuilder('g')
      .insert()
      .into(GroupMemberEntity)
      .values(groupMembers)
      .execute();

    const groupHasConversation = await ConversationEntity.findOne({ where: { channelId: dto.groupId } });
    const groupParticipantsFromUi = [];

    if (groupHasConversation) {

      for (const m of groupMembers) {
        const userInfo = await AccountEntity.findOne(m.contactId);

        let obj = {
          conversationId: groupHasConversation.id,
          groupChatID: dto.groupId,
          accountId: m.contactId,
          accountName: userInfo.firstName ? `${userInfo.firstName} ${userInfo.lastName}` : userInfo.organizationName,
          accountType: userInfo.accountType,
          createdAt: new Date(),
          createdBy: m.createdBy,
          accountImage: userInfo.profileImage ? userInfo.profileImage : userInfo.premisesImage,
        }

        groupParticipantsFromUi.push(obj);
        obj = {} as any;
      }

      await ParticipantEntity.save(groupParticipantsFromUi);
    }
    return result;
  }

  async editGroup(id: string, dto: UpdateGroupDto, user: AccountEntity): Promise<boolean> {
    const exists = await getRepository(GroupEntity).createQueryBuilder('g')
      .where('g.name =:name AND g.ownerId =:owner AND id !=:id', { name: dto.name, owner: user.id, id })
      .getOne();

    if (exists) {
      throw new BadRequestException(`Group '${exists.name}' already exists.`);
    }

    let payload = {};
    if (dto.logo) {
      payload = { name: dto.name, description: dto.description, logo: dto.logo }
    }
    else {
      payload = { name: dto.name, description: dto.description }
    }

    await getRepository(GroupEntity).createQueryBuilder()
      .update(GroupEntity)
      .set(payload)
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
      groupId: group.id,
      createdAt: group.createdAt,
      members: groups,
      ownerId: group.ownerId,
      ownerName: group.ownerName
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
      groupItem = plainToClass(GroupDto, group, { excludeExtraneousValues: true });
      groupItem.members = plainToClass(MemberDto, selectedMembers, { excludeExtraneousValues: true });

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

  async removeGoupMemberId(id: string, groupId: string, user: any, from: string): Promise<boolean> {
    await getConnection().createQueryBuilder().delete().from(GroupMemberEntity)
      .where("contactId =:id AND ownerId =:ownerId AND groupId =:groupId",
        { id, groupId, ownerId: user.id }).execute();

    if(from === 'chat') {

      await getConnection().createQueryBuilder()
      .delete()
      .from(GroupMemberEntity)
      .where("contactId =:id AND groupId =:groupId",
      { id, groupId}).execute();

      await getConnection().createQueryBuilder()
      .delete()
      .from(ParticipantEntity)
      .where("accountId =:id AND groupChatID =:groupId",
      { id, groupId}).execute();
    }
 
    return true;
  }
}
