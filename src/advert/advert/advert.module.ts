import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountModule } from "src/account/account.module";
import { AdvertController } from "./advert.controller";
import { AdvertRepository } from "./advert.repository";
import { AdvertService } from "./advert.service";

@Module({
    imports: [TypeOrmModule.forFeature([AdvertRepository]), AccountModule],
    controllers: [AdvertController],
    providers: [AdvertService],
  })
    export class AdvertModule {}