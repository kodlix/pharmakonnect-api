import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdvertCategoryController } from "./advertcategory.controller";
import { AdvertCategoryRepository } from "./advertcategory.repository";
import { AdvertCategoryService } from "./advertcategory.service";

@Module({
    imports: [TypeOrmModule.forFeature([AdvertCategoryRepository])],
    controllers: [AdvertCategoryController],
    providers: [AdvertCategoryService],
})
export class AdvertCategoryModule {}