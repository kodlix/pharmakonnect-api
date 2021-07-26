import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountModule } from "src/account/account.module";
import { NotificationGateway } from "src/gateway/notification.gateway";
import { AdvertSubscriber } from "src/_common/subscribers/advert.subscriber";
import { AdvertController } from "./advert.controller";
import { AdvertRepository } from "./advert.repository";
import { AdvertService } from "./advert.service";

@Module({
    imports: [TypeOrmModule.forFeature([AdvertRepository]), AccountModule],
    controllers: [AdvertController],
    providers: [AdvertService, AdvertSubscriber, NotificationGateway],
  })
    export class AdvertModule {}