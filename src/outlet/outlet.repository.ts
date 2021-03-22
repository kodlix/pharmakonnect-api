/* eslint-disable prettier/prettier */
import { AccountEntity } from "src/account/entities/account.entity";
import { DeleteResult, EntityRepository, ILike, Repository } from "typeorm";
import { CreateOutletDto } from "./dto/create-outlet.dto";
import { UpdateOutletDto } from "./dto/update-outlet.dto";
import { OutletEntity } from "./entity/outlet.entity";

@EntityRepository(OutletEntity)
export class OutletRepository extends Repository<OutletEntity>{
  async createEntity(
    dto: CreateOutletDto,
    user: AccountEntity,
  ): Promise<OutletEntity> {
    //const branch = await this.findOne({where: { name: dto.name }});
    const outlet = new OutletEntity();

    outlet.name = dto.name;
    outlet.contactPerson = dto.contactPerson;
    outlet.address = dto.address;
    outlet.contactPersonPhonenumber = dto.contactPersonPhonenumber;
    outlet.contactPersonEmail = dto.contactPersonEmail;
    outlet.pcn = dto.pcn;
    outlet.openingTime = dto.openingTime;
    outlet.closingTime = dto.closingTime;
    outlet.organizationName = user.organizationName;
    outlet.createdBy = user.createdBy;
    outlet.accountId = user.id;
    outlet.city = dto.city;
    outlet.longitude = dto.longitude;
    outlet.latitude = dto.latitude;
    outlet.countryName = dto.countryName;
    outlet.countryName = dto.countryName;
    outlet.countryId = dto.countryId;
    outlet.stateName = dto.stateName;
    outlet.stateId = dto.stateId;
    outlet.lgaName = dto.lgaName;
    outlet.lgaId = dto.lgaId;


    return await this.save(outlet);
  }


  async updateEntity(
    id: string,
    dto: UpdateOutletDto,
    user: AccountEntity,
  ): Promise<OutletEntity> {
    const outlet = await this.findOne(id);

    outlet.name = dto.name;
    outlet.contactPerson = dto.contactPerson;
    outlet.address = dto.address;
    outlet.contactPersonPhonenumber = dto.contactPersonPhonenumber;
    outlet.contactPersonEmail = dto.contactPersonEmail;
    outlet.pcn = dto.pcn;
    outlet.openingTime = dto.openingTime;
    outlet.closingTime = dto.closingTime;
    outlet.city = dto.city;
    outlet.longitude = dto.longitude;
    outlet.latitude = dto.latitude;
    outlet.countryName = dto.countryName;
    outlet.countryId = dto.countryId;
    outlet.stateName = dto.stateName;
    outlet.stateId = dto.stateId;
    outlet.lgaName = dto.lgaName;
    outlet.lgaId = dto.lgaId;
    outlet.accountId = user.id;
    outlet.updatedBy = user.createdBy;
    return await this.save(outlet);
  }


  async deleteEntity(id: string): Promise<DeleteResult> {
    const outlet = await this.findOne(id);
    return await this.delete({ id: outlet.id });
  }

  async findById(id: string): Promise<OutletEntity> {
    const outlet = await this.findOne(id);
    return outlet;
  }

  async findByAccountId(accountId: string, page = 1): Promise<OutletEntity[]> {
    const outlet = await this.find({
      where: { accountId: accountId },
      order: { createdAt: 'DESC' },
      take: 25,

      skip: 25 * (page - 1)
    });
    return outlet;
  }

  async findAll(page = 1, searchParam: string): Promise<OutletEntity[]> {
    if (searchParam) {
      const param = `%${searchParam}%`
      const searchResult = await this.find({
        where: [
          { name: ILike(param) },
          { contactPerson: ILike(param) },
          { contactPersonEmail: ILike(param) },
          { contactPersonPhonenumber: ILike(param) },
          { pcn: ILike(param) },
          { address: ILike(param) },
          { organizationName: ILike(param) }
        ],
        order: { createdAt: 'DESC' },
        take: 25,
  
        skip: 25 * (page - 1),
      })

      return searchResult;
    }
    const outlet = await this.find({
      order: { createdAt: 'DESC' },
      take: 25,

      skip: 25 * (page - 1),
    });

    return outlet;
  }
}