import { Injectable, Logger } from "@nestjs/common";
import { AccountRepository } from "src/account/account.repository";
import { AccountEntity } from "src/account/entities/account.entity";
import { NotificationType } from "src/enum/enum";
import { NotificationGateway } from "src/gateway/notification.gateway";
import { NotificationRO } from "src/notifications/notification/interface/notification.interface";
import { NotificationRepository } from "src/notifications/notification/notification.repository";
import { NotificationTypeRepository } from "src/notifications/notificationtype/notificationtype.repository";
import { Connection } from "typeorm";
import { AdvertRO } from "./advert.interface";
import { AdvertRepository } from "./advert.repository";
import { CreateAdvertDto } from "./dto/create-advert";
import { ApproveAdvertDto, RejectAdvertDto, UpdateAdvertDto } from "./dto/update-advert";

@Injectable()
export class AdvertService{
    private  notTypeRepo: NotificationTypeRepository;
    private  notiRepo: NotificationRepository;
    private  acctRepo: AccountRepository;

    constructor(private readonly advertRepository: AdvertRepository, connection: Connection, private readonly notiGateway: NotificationGateway) {
        this.notTypeRepo = connection.getCustomRepository(NotificationTypeRepository);
      this.notiRepo = connection.getCustomRepository(NotificationRepository);
      this.acctRepo = connection.getCustomRepository(AccountRepository);

     }

    async create(
        dto: CreateAdvertDto,
        user: AccountEntity
    ): Promise<AdvertRO> {
        return await this.advertRepository.createEntity(dto, user);
    }

    async update(id: string, dto: UpdateAdvertDto, user: AccountEntity): Promise<AdvertRO> {
        return await this.advertRepository.updateEntity(id, dto, user);
    }

    async updateApprove(
        id: string,
        user: AccountEntity
      ): Promise<AdvertRO> {
        const result = await this.advertRepository.updateApprove(id, user);

        const notType = await this.notTypeRepo.findOne({where: {name: NotificationType.ADVERT}});
        
        const {id: adminId, profileImage} = await this.acctRepo.findByEmail("admin@netopng.com");
        
        const noti: NotificationRO = {
          message: `Hi ${result.createdBy}, your advert has been approved`,
          senderId: adminId,
          entityId: result.id,
          recieverId: result.accountId,
          isGeneral: false,
          accountId: result.accountId,
          createdAt: new Date(),
          seen: false,
          senderImageUrl: profileImage ? profileImage : null,
          notificationType: notType,
          createdBy: "admin@netopng.com"
        }
  
        try {
          await this.notiRepo.save(noti);
          this.notiGateway.sendToUser(noti, result.accountId);
        } catch (err) {
          Logger.log(err);
          return result;
        }
  
        return result;
        
      }
    
      async updateReject(
        id: string,
        dto: RejectAdvertDto,
        user: AccountEntity
      ): Promise<AdvertRO> {
        const result = await this.advertRepository.updateReject(id, dto, user);

        const notType = await this.notTypeRepo.findOne({where: {name: NotificationType.ADVERT}});
       
        const {id: adminId, profileImage} = await this.acctRepo.findByEmail("admin@netopng.com");
        
        const noti: NotificationRO = {
          message: `Hi ${result.createdBy}, your advert has been rejected`,
          senderId: adminId,
          entityId: result.id,
          recieverId: result.accountId,
          isGeneral: false,
          accountId: result.accountId,
          createdAt: new Date(),
          seen: false,
          senderImageUrl: profileImage ? profileImage : null,
          notificationType: notType,
          createdBy: "admin@netopng.com"
        }
  
        try {
          await this.notiRepo.save(noti);
          this.notiGateway.sendToUser(noti, result.accountId);
        } catch (err) {
          Logger.log(err);
          return result;
        }
  
        return result;
      }

    // async uploadAdvertImage(advertImage: string, advertId: string) {
    //     return await this.advertRepository.uploadAdvertImage(advertImage, advertId);
    // }

    async findAll(page, search): Promise<AdvertRO[]> {
        return await this.advertRepository.findall(page, search);
    }

    async findOne(id: string): Promise<AdvertRO> {
        return await this.advertRepository.findById(id);
    }

    async findByAccountId(accountId: string, page): Promise<AdvertRO[]> {
        return await this.advertRepository.findByAccountId(accountId, page);
    }

    
    async findByApproved( page): Promise<AdvertRO[]> {
        return await this.advertRepository.findByAprroved(page);
    }

    async remove(id: string) {
        return await this.advertRepository.deleteEntity(id);
    }

} 