/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsArray } from "class-validator";
import { FeatureEntity } from "../../features/entity/feature.entity";

export class CreatePackageFeaturesDto{

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    packageId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty()
    readonly features : FeatureEntity[]


}