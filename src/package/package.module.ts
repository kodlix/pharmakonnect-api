/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountModule } from "src/account/account.module";
import { PackageFeatureEntity } from "./entities/packagefeature.entity";
import { PackageFeatureRepository } from "./package-feature.repository";
import { PackageController } from "./package.controller";
import { PackageService } from "./package.service";

@Module({
   imports: [TypeOrmModule.forFeature([PackageFeatureEntity]),AccountModule],
    controllers: [PackageController],
    providers: [PackageService, PackageFeatureRepository],
  })
  export class PackageModule {}