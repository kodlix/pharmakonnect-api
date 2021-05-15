import { DeleteResult, EntityRepository, Repository } from "typeorm";
import { AdvertCategoryEntity } from "../entity/advertcategory.entity";
import { CreateAdvertCategoryDto } from "./dto/create-advertcategory";
import { UpdateAdvertCategoryDto } from "./dto/update-advertcategory";


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

    async findAll(): Promise<AdvertCategoryEntity[]> {
        const adcat = await this.find();    
        return adcat;
      }
    
      async deleteEntity(id: string): Promise<DeleteResult> {
        const adcat = await this.findOne(id);
        return await this.delete({ id: adcat.id });
      }
    
}