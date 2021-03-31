import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsArray } from "class-validator";
import { FeatureEntity } from "src/features/entity/feature.entity";

export class UpdatePackageFeaturesDto{

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