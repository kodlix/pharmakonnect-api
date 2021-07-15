/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from "@nestjs/common";
import { AccountEntity } from "src/account/entities/account.entity";
import { Brackets, DeleteResult, EntityRepository, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { AdvertEntity } from "../entity/advert.entity";
import { CreateAdvertDto } from "./dto/create-advert";
import { RejectAdvertDto, UpdateAdvertDto } from "./dto/update-advert";
import {validate} from 'class-validator';
import { isNotValidDate } from "src/_utility/date-validator.util";


@EntityRepository(AdvertEntity)
export class AdvertRepository extends Repository<AdvertEntity>{
   async createEntity(
      dto: CreateAdvertDto,
      user: AccountEntity
    ): Promise<AdvertEntity> {
      
      const checkAdvert = await this.findOne({ where: { title: ILike(`%${dto.title}%`), companyName: ILike(`%${dto.companyName}%`) } });
      const advert = new AdvertEntity();  

      if ( checkAdvert ){
        throw new HttpException( `Advert with ${dto.title} and Company  ${dto.companyName} already exist`, HttpStatus.BAD_REQUEST);
      }

      if (isNotValidDate (dto.endDate)) {
        throw new HttpException(
          `End date of Advert '${dto.title}' can not be less than today`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if(new Date(dto.endDate).setHours(0,0,0,0) < new Date(dto.startDate).setHours(0,0,0,0)) {
        throw new HttpException(`Start date of advert cannot be greater than End date`, HttpStatus.BAD_REQUEST,);
    }

    // if (dto.url) {
    //   const isValidUrl = validateUrl(dto.url);
    //   if (!isValidUrl) {
    //     throw new HttpException(`The advert url ${dto.url} is not valid`, HttpStatus.BAD_REQUEST)
    //   }
    // }

    // if (dto.website) {
    //   const isValidUrl = validateUrl(dto.website);
    //   if (!isValidUrl) {
    //     throw new HttpException(`The company url ${dto.website} is not valid`, HttpStatus.BAD_REQUEST)
    //   }
    // }
      
        advert.title = dto.title;
        advert.companyName = dto.companyName;
        advert.contactPerson = dto.contactPerson;
        advert.url = dto.url;        
        advert.startDate = dto.startDate;           
        advert.endDate = dto.endDate;        
        advert.advertiserId = dto.advertiserId;
        advert.advertCategoryId = dto.advertCategory
        advert.zone = dto.zone;
        advert.website = dto.website;
        advert.contactPhoneNumber = dto.contactPhoneNumber;
        advert.description = dto.description;
        advert.accountId = user.id;
        advert.createdBy = user.email
        advert.advertImage = dto.advertImage;
        advert.createdAt = new Date();

  
      const errors = await validate(advert);
      if(errors.length > 0) {
        throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

      return await this.save(advert);
    }

    async updateEntity(
      id: string,
      dto: UpdateAdvertDto,
      user: AccountEntity,
      filename: string

    ): Promise<AdvertEntity> {
      const advert = await this.findOne(id);
      
      const checkAdvert = await this.findOne({ where: { title: ILike(`%${dto.title}%`), companyName: ILike(`%${dto.companyName}%`) } });

      if (isNotValidDate (dto.endDate)) {
        throw new HttpException(
          `End date of Advert '${dto.title}' can not be less than today`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if(new Date(dto.endDate).setHours(0,0,0,0) < new Date(dto.startDate).setHours(0,0,0,0)) {
        throw new HttpException(`Start date of advert cannot be greater than End date`, HttpStatus.BAD_REQUEST,);
      }



      advert.title = dto.title;
      advert.companyName = dto.companyName;
      advert.contactPerson = dto.contactPerson;
      advert.url = dto.url;        
      advert.startDate = dto.startDate;        
      advert.endDate = dto.endDate;        
      advert.advertiserId = dto.advertiserId;
      advert.advertCategoryId = dto.advertCategory
      advert.zone = dto.zone;
      advert.website = dto.website;
      advert.contactPhoneNumber = dto.contactPhoneNumber;
      advert.description = dto.description;
      advert.accountId = user.id;
      advert.updatedBy = user.email;
      advert.updatedAt = new Date();
      advert.approved = false;
      advert.rejected = false;
    
      if(filename) {
        advert.advertImage = filename;
    } else {
        if(advert.advertImage) {
            dto.advertImage = advert.advertImage;
        }
    }

    //   if(filename) {
    //     advert.advertImage = filename;
    // }
    // else{
    //     advert.advertImage = dto.advertImage;
    // }
      
      return await this.save(advert);
    }

    async updateApprove(
      id: string,
      user: AccountEntity

    ): Promise<AdvertEntity> {
      const advert = await this.findOne(id);
  
      advert.approvedOn = new Date();
      advert.approvedBy = user.email;
      advert.approved = true;
      advert.rejected = false;

      return await advert.save();
    }

    async updateReject(
      id: string,
      dto: RejectAdvertDto,
      user: AccountEntity

    ): Promise<AdvertEntity> {
      const advert = await this.findOne(id);
  
      advert.rejectedBy = user.email;
      advert.rejectionMessage = dto.rejectionMessage
      advert.approved = false;
      advert.rejected = true;
      
      return await advert.save();
    }

    // public async uploadAdvertImage(advertImage: string, advertId: string) {
    //     const adimage = await this.findOne({ id: advertId });
    //     if (!adimage) {
    //     throw new HttpException(
    //         `advert does not exist`,
    //         HttpStatus.NOT_FOUND,
    //     );}   

    //     adimage.advertImage = advertImage;
    //     return await adimage.save();
    // }
    

    async findall(page: number,search: string ): Promise<AdvertEntity[]> {
        if(search) {

          const advert =  await this.createQueryBuilder("advert")
                   .leftJoinAndSelect("advert.advertCategory", "advertCategory")
                   .where(new Brackets(qb => {
                       qb.where("advert.companyName ILike :companyName", { companyName: `%${search}%` })
                       .orWhere("advert.title ILike :title", { title: `%${search}%` })
                       .orWhere("advert.advertserId ILike :advertserId", { advertserId: `%${search}%` })
                       .orWhere("advertCategory.name ILike :name", { name: `%${search}%`})
                   }))
                   .orderBy("advert.ApprovedOn", "DESC")
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
      const advert = await this.findOne(id,
        {
          relations: ['advertCategory'],
        }
        )

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


    async findByAprroved(page = 1 ): Promise<AdvertEntity[]> {

      const today = new Date();
      const advert = await this.find({
        relations: ["advertCategory"],
        where: {approved: true , rejected : false , startDate: LessThanOrEqual (today), endDate: MoreThanOrEqual(today)},
        order: { approvedOn: 'DESC' },

        take: 25,  
        skip: 25 * (page - 1)
      });
      return advert;
  }
}

function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}