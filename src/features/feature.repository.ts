/* eslint-disable prettier/prettier */
import { AccountEntity } from "src/account/entities/account.entity";
import { DeleteResult, EntityRepository, Repository } from "typeorm";
import { CreateFeatureDto } from "./dto/createfeature.dto";
import { UpdateFeatureDto } from "./dto/update-feature.dto";
import { FeatureEntity } from "./entity/feature.entity";

@EntityRepository(FeatureEntity)
export class FeatureRepository extends Repository<FeatureEntity>{
   async createEntity(
      dto: CreateFeatureDto,
      user: AccountEntity
    ): Promise<FeatureEntity> {
      const feature = new FeatureEntity();        
  
      feature.name = dto.name;
      feature.value = dto.value;
      feature.valueType = dto.valueType;
      feature.unit = dto.unit;
      feature.createdBy = user.createdBy;
      feature.accountId = user.id;
  
      return await this.save(feature);
  }
  async updateEntity(
    id: string,
    dto: UpdateFeatureDto,
  ): Promise<FeatureEntity> {
    const feature = await this.findOne(id);

    feature.name = dto.name;
    feature.value = dto.value;
    feature.valueType = dto.valueType;
    feature.unit = dto.unit;

    return await this.save(feature);
  }

  async findAll(): Promise<FeatureEntity[]> {
    const feature = await this.find();    
    return feature;
  }

  async deleteEntity(id: string): Promise<DeleteResult> {
    const feature = await this.findOne(id);
    return await this.delete({ id: feature.id });
  }

}