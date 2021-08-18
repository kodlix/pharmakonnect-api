import { Injectable } from '@nestjs/common';
import { AccountEntity } from 'src/account/entities/account.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModuleRepository } from './module.repository';

@Injectable()
export class ModuleService {

  constructor(private readonly moduleRepo: ModuleRepository) {

  }

  async create(createModuleDto: CreateModuleDto, user: AccountEntity): Promise<string> {
    return await this.moduleRepo.saveModule(createModuleDto, user);
  }

  async findAll() {
    return await this.moduleRepo.getAllModules();
  }

  async findOne(id: string) {
    return await this.moduleRepo.findModuleById(id);
  }

  async update(id: string, updateModuleDto: UpdateModuleDto, user: AccountEntity) {
    return await this.moduleRepo.updateModule(id, updateModuleDto, user);
  }

  async remove(id: string) {
    return await this.moduleRepo.deleteModule(id);
  }
}
