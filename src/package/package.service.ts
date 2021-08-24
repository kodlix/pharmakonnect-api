import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeleteResult, Repository} from "typeorm";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import {validate} from 'class-validator';
import { AccountEntity } from "src/account/entities/account.entity";
import { PackageEntity } from "./entities/package.entity";
import { CreatePackageDto } from "./dto/create-package.dto";
import { PackageRO } from "./interfaces/package.interface";
import { UpdatePackageDto } from "./dto/update-package.dto";
import { InjectRepository } from "@nestjs/typeorm";



@Injectable()
export class PackageService {
    constructor(
        @InjectRepository(PackageEntity)
        private readonly zoneRepository: Repository<PackageEntity>
      ) { }

    async createEntity(payload: CreatePackageDto, user: AccountEntity) : Promise<string> {

        const isPackageExist = await this.zoneRepository.findOne({where: {name: payload.name}});
        if(isPackageExist) {
            throw new HttpException( `Package with ${payload.name} already exist`, HttpStatus.BAD_REQUEST);
        }

        const newPackage = plainToClass(PackageEntity, payload);
        newPackage.createdBy = user.createdBy;        

        const errors = await validate(newPackage);

        if(errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        try {
             await this.zoneRepository.save(newPackage);
             return "Package successfully saved";
        } catch(error)  {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getAll(): Promise<PackageRO[]> {
        
        return await this.zoneRepository.find();
    }

    async findById(id: string): Promise<PackageRO> {

        const packagefeature = await this.zoneRepository.findOne(id);
        if(packagefeature) {
            return packagefeature;
        }
        throw new HttpException(`The package cannot be found`, HttpStatus.NOT_FOUND);

    }
    
    async delete(id: string): Promise<DeleteResult> {

        const packagefeature = await this.zoneRepository.findOne(id);
        if(packagefeature) {
            return await this.zoneRepository.delete(packagefeature.id);
        }

        throw new HttpException(`The package cannot be found`, HttpStatus.NOT_FOUND);

    }

    async updateEntity(id: string, payload: UpdatePackageDto, user: AccountEntity) : Promise<string> {
        const packagefeature = await this.zoneRepository.findOne(id);
        if (packagefeature ) {

            if( packagefeature.name != payload.name) {
                
                const nameExist = await this.zoneRepository.findOne({where: {name: payload.name}});
                if(nameExist){
                    throw new HttpException( `Package with ${payload.name} is already in use`, HttpStatus.BAD_REQUEST);
                }
            }
         

            packagefeature.updatedAt = new Date();
            packagefeature.updatedBy = user.updatedBy || user.createdBy;

            const updated = plainToClassFromExist(packagefeature, payload);

            try {
                 await this.zoneRepository.save(updated);
                 return "Package successfully updated";
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        throw new HttpException(`The package cannot be found`, HttpStatus.NOT_FOUND);
    }

}