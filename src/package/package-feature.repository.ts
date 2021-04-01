/* eslint-disable prettier/prettier */
import { DeleteResult, EntityRepository, getRepository } from "typeorm";
import { CreatePackageFeaturesDto } from "./dto/createpackage-feature.dto";
import { PackageFeatureEntity } from "./entities/packagefeature.entity";

// @EntityRepository(PackageFeatureEntity)
export class PackageFeatureRepository {
  // private readonly repository = getRepository(PackageFeatureEntity);
  //   async createEntity(
  //       dto: CreatePackageFeaturesDto,
  //     ): Promise<PackageFeatureEntity> {
          
  //       const packages = Array<PackageFeatureEntity>();

  //       for (const feature of dto.features) {
  //           const newPackage = new PackageFeatureEntity();   
  //           newPackage.packageName = dto.name;
  //           newPackage.packageId = dto.packageId;
  //           newPackage.featureId = feature.id;
  //           newPackage.featureName = feature.name;
  //           packages.push(newPackage)
  //       } 
           
  //       return await this.repository.save(packages);
  //   }

  //   async findAll(): Promise<PackageFeatureEntity[]> {
  //     const packages = await this.repository.find();      
  //     return packages;
  //   }

  //   async deleteEntity(id: string): Promise<DeleteResult> {
  //     const packages = await this.repository.findOne(id);
  //     return await this.repository.delete({ id: packages.id });
  //   }
}

