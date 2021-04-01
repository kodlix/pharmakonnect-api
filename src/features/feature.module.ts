/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountModule } from "src/account/account.module";
import { FeatureController } from "./feature.controller";
import { FeatureRepository } from "./feature.repository";
import { FeatureService } from "./feature.service";

@Module({
    imports: [TypeOrmModule.forFeature([FeatureRepository]), AccountModule],
    controllers: [FeatureController],
    providers: [FeatureService],
  })
export class FeatureModule {}