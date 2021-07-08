/* eslint-disable prettier/prettier */
import { DeleteResult, EntityRepository, Repository } from "typeorm";
import { AdvertCategoryEntity } from "../entity/advertcategory.entity";
import { CreateAdvertCategoryDto } from "./dto/create-advertcategory";
import { UpdateAdvertCategoryDto } from "./dto/update-advertcategory";
import { getRepository } from 'typeorm';
import { AdvertEntity } from './../entity/advert.entity';


@EntityRepository(AdvertCategoryEntity)
export class AdvertCategoryRepository extends Repository<AdvertCategoryEntity>{
    async createEntity(
        dto: CreateAdvertCategoryDto,
      ): Promise<AdvertCategoryEntity> {
        const adcat = new AdvertCategoryEntity();        
    
        adcat.name = dto.name;
        adcat.description = dto.description;
    
        return await this.save(adcat);
    }

    async updateEntity(
        id: string,
        dto: UpdateAdvertCategoryDto,
        ): Promise<AdvertCategoryEntity>{
          const adcat = await this.findOne(id);  

            adcat.name = dto.name;
            adcat.description = dto.description;
    
        return await this.save(adcat);

    }

    async advertCategoryInUse(categoryId: string): Promise<boolean> {
      const advert = await getRepository(AdvertEntity).createQueryBuilder('advert')
      .where("advert.advertCategoryId = :categoryId", {categoryId})
      .getOne();

      console.log(advert);
      
      if(advert){
        return true
      }
      else{
        return false;
      }
    }

  async findAll(): Promise<AdvertCategoryEntity[]> {
      const adcat = await this.find();    
      return adcat;
    }

    async findById(id: string): Promise<AdvertCategoryEntity> {
      const adcat = await this.findOne(id);
      return adcat;
    }
    
    async deleteEntity(id: string): Promise<DeleteResult> {
      const adcat = await this.findOne(id);
      return await this.delete({ id: adcat.id });
    }
    
}