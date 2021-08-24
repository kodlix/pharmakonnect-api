import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString, IsNotEmpty, IsBoolean } from "class-validator";

export class CreateOrganizationCategoryDto {
    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Name cannot be empty'})
    name: string;

    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Description cannot be empty'})
    description: string;

    @Expose()
    @IsBoolean()
    @ApiPropertyOptional()
    requiresPremise: boolean;

}
