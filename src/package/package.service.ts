import { Injectable } from "@nestjs/common";
import { AccountEntity } from "src/account/entities/account.entity";
import { DeleteResult, getRepository, Repository } from "typeorm";
import { CreatePackageFeaturesDto } from "./dto/createpackage-feature.dto";
import { UpdatePackageFeaturesDto } from "./dto/updatepackage-feature.dto";
import { PackageFeatureEntity } from "./entities/packagefeature.entity";

@Injectable()
export class PackageService extends Repository<PackageFeatureEntity> {

      async createEntity(
        dto: CreatePackageFeaturesDto,
        user: AccountEntity
      ): Promise<any[]> {

        const repository = await getRepository(PackageFeatureEntity);
          
        const packages = Array<PackageFeatureEntity>();

        for (const feature of dto.features) {
            const newPackage = new PackageFeatureEntity();   
            newPackage.packageName = dto.name;
            newPackage.packageId = dto.packageId;
            newPackage.featureId = feature.id;
            newPackage.featureName = feature.name;
            newPackage.createdBy = user.createdBy;
            newPackage.accountId = user.id;
            packages.push(newPackage)
        } 
           
        return await repository.save(packages);
    }

    async updateEntity(
      id: string,
      dto: UpdatePackageFeaturesDto,
      user: AccountEntity,
    ): Promise<any> {
      const repository = await getRepository(PackageFeatureEntity);

    
        let packages = new PackageFeatureEntity;
        packages = await this.findOne(id);
        
        for (const feature of dto.features) {
            const newPackage = new PackageFeatureEntity();   
            newPackage.packageName = dto.name;
            newPackage.packageId = dto.packageId;
            newPackage.featureId = feature.id;
            newPackage.featureName = feature.name;
            newPackage.updatedBy = user.createdBy;
            newPackage.accountId = user.id;
          
           // packages.push(newPackage)
        } 
                 
        return await repository.save(packages);
    }

    async findAll(): Promise<PackageFeatureEntity[]> {
      const repository = await getRepository(PackageFeatureEntity);

      const packages = await repository.find();      
      return packages;
    }

    async deleteEntity(id: string): Promise<DeleteResult> {

      const repository = await getRepository(PackageFeatureEntity);

      const packages = await repository.findOne(id);
      return await repository.delete({ id: packages.id });
    }






    // constructor(private readonly packageRepository: PackageFeatureRepository) { }

    // async create(
    //     dto: CreatePackageFeaturesDto,
        
    // ): Promise<PackageRO[]> {
    //     return await this.packageRepository.createEntity(dto);
    // }

    // async findAll(): Promise<PackageRO[]> {
    //     return await this.packageRepository.findAll();
    // }

    // async remove(id: string) {
    //     return await this.packageRepository.deleteEntity(id);
    // }
}

function InjectRepository(User: any) {
    throw new Error("Function not implemented.");
}
