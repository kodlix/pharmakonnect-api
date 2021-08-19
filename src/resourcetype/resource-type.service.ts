import { Injectable } from '@nestjs/common';
import { AccountEntity } from 'src/account/entities/account.entity';
import { CreateResourceTypeDto } from './dto/create-resource-type.dto';
import { UpdateResourceTypeDto } from './dto/update-resource-type.dto';
import { ResourceTypeRepository } from './resource-type.repository';

@Injectable()
export class ResourceTypeService {

  constructor(private readonly resourceTypeRepo: ResourceTypeRepository) {

  }

  async create(createResourceTypeDto: CreateResourceTypeDto, user: AccountEntity): Promise<string> {
    return await this.resourceTypeRepo.saveResourceType(createResourceTypeDto, user);
  }

  async findAll() {
    return await this.resourceTypeRepo.getAllResourceTypes();
  }

  async findOne(id: string) {
    return await this.resourceTypeRepo.findResourceTypeById(id);
  }

  async update(id: string, updateResourceTypeDto: UpdateResourceTypeDto, user: AccountEntity) {
    return await this.resourceTypeRepo.updateResourceType(id, updateResourceTypeDto, user);
  }

  async remove(id: string) {
    return await this.resourceTypeRepo.deleteResourceType(id);
  }
}
