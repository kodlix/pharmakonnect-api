import { HttpException, HttpStatus } from "@nestjs/common";
import { AccountEntity } from "src/account/entities/account.entity";
import { Brackets, DeleteResult, EntityRepository, ILike, Repository } from "typeorm";
import { AdvertEntity } from "../entity/advert.entity";
import { CreateAdvertDto } from "./dto/create-advert";
import { UpdateAdvertDto } from "./dto/update-advert";

@EntityRepository(AdvertEntity)
export class AdvertRepository extends Repository<AdvertEntity>{
   async createEntity(
      dto: CreateAdvertDto,
      user: AccountEntity
    ): Promise<AdvertEntity> {
      const advert = new AdvertEntity();        
  
        advert.title = dto.title;
        advert.companyName = dto.companyName;
        advert.contactPerson = dto.contactPerson;
        advert.url = dto.url;        
        advert.publishedAt = dto.publishedAt;   
        advert.endDate = dto.endDate;        
        advert.advertserId = dto.advertserId;
        advert.advertCategoryId = dto.advertCategory
        advert.zone = dto.zone;
        advert.website = dto.website;
        advert.contactPhoneNumber = dto.contactPhoneNumber;
        advert.accountId = user.id;
        advert.createdBy = user.email
        advert.createdAt = new Date();
  
      return await this.save(advert);
    }

    async updateEntity(
      id: string,
      dto: UpdateAdvertDto,
      user: AccountEntity,
    ): Promise<AdvertEntity> {
      const advert = await this.findOne(id);
      advert.title = dto.title;
      advert.companyName = dto.companyName;
      advert.contactPerson = dto.contactPerson;
      advert.url = dto.url;        
      advert.publishedAt = dto.publishedAt;   
      advert.endDate = dto.endDate;        
      advert.advertserId = dto.advertserId;
      advert.advertCategoryId = dto.advertCategory
      advert.zone = dto.zone;
      advert.website = dto.website;
      advert.contactPhoneNumber = dto.contactPhoneNumber;
      advert.accountId = user.id;
      advert.updatedBy = user.email;
      advert.updatedAt = new Date();

      return await this.save(advert);
    }

    public async uploadAdvertImage(advertImage: string, advertId: string) {
        const adimage = await this.findOne({ id: advertId });
        if (!adimage) {
        throw new HttpException(
            `advert does not exist`,
            HttpStatus.NOT_FOUND,
        );}   

        adimage.advertImage = advertImage;
        return await adimage.save();
    }
    

    async findall(page: number,search: string ): Promise<AdvertEntity[]> {
        if(search) {

          const advert =  await this.createQueryBuilder("advert")
                   .where(new Brackets(qb => {
                       qb.where("advert.companyName ILike :companyName", { companyName: `%${search}%` })
                       .orWhere("advert.title ILike :title", { title: `%${search}%` })
                       .orWhere("advert.advertserId ILike :advertserId", { advertserId: `%${search}%` })
                   }))
                   .orderBy("advert.createdAt", "DESC")
                   .take(25)
                   .skip(25 * (page ? page - 1 : 0))
                   .getMany();
      
           return advert;
      }
      
      return await this.find({ order: { createdAt: 'DESC' }, take: 25, skip: page ? 25 * (page - 1) : 0});

    }

    async deleteEntity(id: string): Promise<DeleteResult> {
      const advert = await this.findOne(id);
      return await this.delete({ id: advert.id });
    }
  
    async findById(id: string): Promise<AdvertEntity> {
      const advert = await this.findOne(id);
      return advert;
    }
  
    async findByAccountId(accountId: string, page = 1): Promise<AdvertEntity[]> {
      const advert = await this.find({
        where: { accountId: accountId },
        order: { createdAt: 'DESC' },
        take: 25,
  
        skip: 25 * (page - 1)
      });
      return advert;
    }
}
