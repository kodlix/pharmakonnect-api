import { BadRequestException } from '@nestjs/common';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getRepository, Repository, getConnection, Brackets } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactEntity } from './entities/contact.entity';

@Injectable()
export class ContactService extends Repository<ContactEntity> {


  async createContact(dto: CreateContactDto[], user: any): Promise<any[]> {
    try {
      const contactrepository = await getRepository(ContactEntity);
      let contactArr = []
      let contactExist = [];
      for (let value of dto) {
        let isExist = await getRepository(ContactEntity).findOne({ where: { creatorId: user.id, accountId: value.accountId } })

        if (isExist) {
          contactExist.push(value.firstName + ' ' + value.lastName + ' Already exist in your contact')
        } else {
          let contact = new ContactEntity()
          contact.accountId = value.accountId;
          contact.creatorId = user.id;
          contact.email = value.email;
          contact.firstName = value.firstName;
          contact.lastName = value.lastName;
          contact.phoneNo = value.phoneNo;
          contact.createdBy = user.createdBy //use created by

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

  async findAll(page = 1, take = 20, user: any): Promise<ContactEntity[]> {

    page = +page;
    take = take && +take || 20;


    const conversations = await getRepository(ContactEntity)
      .createQueryBuilder('conversation')
      .where('conversation.creatorId = :id', { id: user.id })
      .skip(take * (page - 1))
      .take(take)
      .getMany();
    return conversations
  }

  async getContactbyId(id: string) {
    const contact = await getRepository(ContactEntity).findOne({ where: { id: id } });
    return contact
  }

  async getContactbyAccountId(id: string) {
    const contact = await getRepository(ContactEntity).findOne({ where: { accountId: id } });
    return contact
  }

  

  // update(id: number, updateContactDto: UpdateContactDto) {
  //   return `This action updates a #${id} contact`;
  // }

  async removebyId(id: string) {
    const isDeleted = await getConnection().createQueryBuilder().delete().from(ContactEntity)
      .where("id = :id", { id }).execute();
    return isDeleted
  }

    async loadChatContact(search: string, user: any): Promise<ContactEntity[]> {

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
          
          return ctcs;
      }

      return this.findAll(1, 20, user);
    }

      
}
