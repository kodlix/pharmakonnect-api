import { AccountEntity } from "src/account/entities/account.entity";
import { CountryEntity } from "src/country/entities/country.entity";
import { LgaEntity } from "src/lga/entities/lga.entity";
import { StateEntity } from "src/state/entities/state.entity";
import { DeleteResult, EntityRepository, ILike, Like, Repository } from "typeorm";
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
    outlet.pcn = dto.pcn;
    outlet.openingTime = dto.openingTime;
    outlet.closingTime = dto.closingTime;
    outlet.organizationName = dto.organizationName;
    outlet.createdBy = user.createdBy;
    outlet.accountId = user.id;
    outlet.createdBy = user.createdBy;
    outlet.country = dto.country;
    outlet.state = dto.state;
    outlet.lga = dto.lga;


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
    outlet.pcn = dto.pcn;
    outlet.openingTime = dto.openingTime;
    outlet.closingTime = dto.closingTime;
    outlet.organizationName = dto.organizationName;
    outlet.country = dto.country;
    outlet.state = dto.state;
    outlet.lga = dto.lga;
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

  async findByAccountId(accountId: string, page: number = 1): Promise<OutletEntity[]> {
    const outlet = await this.find({
      where: { accountId: accountId },
      order: { createdAt: 'DESC' },
      take: 25,

      skip: 25 * (page - 1)
    });
    return outlet;
  }

  async findAll(page: number = 1, searchParam: string): Promise<OutletEntity[]> {
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