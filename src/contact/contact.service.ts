import { BadRequestException } from '@nestjs/common';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountService } from 'src/account/account.service';
import { AccountEntity } from 'src/account/entities/account.entity';
import { GroupService } from 'src/group/group.service';
import { getRepository, Repository, getConnection, Brackets } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactEntity } from './entities/contact.entity';

@Injectable()
export class ContactService  {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly repository: Repository<ContactEntity>,
    private readonly groupSvc: GroupService,
    private acctSvc: AccountService
  ) { }

  async createContact(dto: CreateContactDto[], user: any): Promise<any[]> {
    try {
      const contactrepository = await getRepository(ContactEntity);
      let contactArr = []
      let contactExist = [];
      for (let value of dto) {
        let isExist = await getRepository(ContactEntity).findOne({ where: { creatorId: user.id, accountId: value.accountId } })

        if (isExist) {
          contactExist.push('User already exist in your contact.')
        } else {
          let contact = new ContactEntity()
          contact.accountId = value.accountId;
          contact.creatorId = user.id;
          contact.createdBy = user.createdBy //use created by
          contact.firstName = value.firstName;
          contact.lastName = value.lastName;
          contact.phoneNo = value.phoneNo;
          contact.email = value.email;

          contactArr.push(contact)
        }
      }
      if (contactExist.length > 0) {
        throw new BadRequestException(contactExist[0])
      }

      return await contactrepository.save(contactArr);

    } catch (error) {
      throw new HttpException({ error: `An error occured`, status: HttpStatus.INTERNAL_SERVER_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR);
    }


  }

  async findAll(page = 1, take = 20, user: any, from: string): Promise<AccountEntity[]> {

    page = +page;
    take = take && +take || 20;


    const conversations = await getRepository(ContactEntity)
      .createQueryBuilder('conversation')
      .where('conversation.creatorId = :id', { id: user.id })
      .getMany();

      const userIds = conversations.map(x => x.accountId);

      if (userIds.length > 0) {
        const result = await getRepository(AccountEntity)
            .createQueryBuilder('a')
            .where('a.id IN (:...userIds)', {userIds})
            .skip(take * (page - 1))
            .take(take)
            .getMany();

          
          if(from === 'chat') {
            const myGroups = await this.groupSvc.getGroupByOwner(user);
            const groupWithMembers = myGroups.filter(x => x.members.length > 0);
            const shapedData = [];
            if(groupWithMembers.length > 0) {

              for (const g of groupWithMembers) {

                    let data = {
                      id: g.groupId,
                      profileImage: g.logo,
                      firstName: g.groupName,
                      isGroupChat: true,
                      groupDescription: g.groupDescription,
                      ownerId: g.ownerId,
                      ownerName: g.ownerName
                    }
    
                    shapedData.push(data);
                    data = {} as any;
                  
              }

              if(shapedData.length > 0) {
                result.push(...shapedData);
              }
              return result;
            }
          }
          
          return result;
      }
  }

  async getContactbyId(id: string) {
    const contact = await getRepository(ContactEntity).findOne({ where: { id: id } });
    return contact
  }

  async getContactbyAccountId(id: string) {
    //const contact = await getRepository(ContactEntity).findOne({ where: { accountId: id } });

    const user = await getRepository(AccountEntity)
            .createQueryBuilder('a')
            .where("a.id = :id", {id})
            .getOne();

    if(user) {
      return user;
    }
    
    const group = await this.groupSvc.getGroupbyId(id);
    const data = {
      id: group.groupId,
      profileImage: group.logo,
      firstName: group.name,
      groupDescription: group.description,
      members: group.members,
      isGroupChat: true,
      ownerId: group.ownerId,
      ownerName:group.ownerName
    }

    return data;

  }

  

  // update(id: number, updateContactDto: UpdateContactDto) {
  //   return `This action updates a #${id} contact`;
  // }

  async removebyId(id: string) {
    const isDeleted =  await this.repository.delete({accountId: id});
    return isDeleted
  }

    async loadChatContact(search: string, user: any): Promise<AccountEntity[]> {

      if(search) {
          const ctcs = await getRepository(ContactEntity)
          .createQueryBuilder('ctc')
          .where('ctc.creatorId = :id', { id: user.id })
          .andWhere(new Brackets(qb => {
            qb.where("ctc.firstName ILike :fname", { fname: `%${search}%` })
            .orWhere("ctc.lastName ILike :lname", { lname: `%${search}%` })
            .orWhere("ctc.email ILike :email", { email: `%${search}%` })
        }))
          .getMany();

          
      const userIds = ctcs.map(x => x.accountId);

      if (userIds.length > 0) {
        return await getRepository(AccountEntity)
        .createQueryBuilder('a')
        .where('a.id IN (:...userIds)', {userIds})
        .getMany();
      }
          
          //return ctcs;
      }

      //return await this.repository.find({creatorId: user.id});
    }

    async addToContacts(id: string, user: AccountEntity): Promise<any>{
      const userToAdd = await this.acctSvc.findOne(id);
      if(!user) {
        throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
      }

      const isExist = await getRepository(ContactEntity).findOne({ where: { creatorId: user.id, accountId: id } })
      
      if (isExist) {
        throw new HttpException('User already exist in your contact.', HttpStatus.BAD_REQUEST);
      } else {
        const contact = new ContactEntity()
        contact.accountId = userToAdd.id;
        contact.creatorId = user.id;
        contact.createdBy = user.createdBy;
        contact.firstName = userToAdd.firstName;
        contact.lastName = userToAdd.lastName;
        contact.phoneNo = userToAdd.phoneNumber;
        contact.email = userToAdd.email;

        try {
          return await this.repository.save(contact);

        } catch (error) {
          throw new HttpException(`Unable to add to contacts. Error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }

    }
}
