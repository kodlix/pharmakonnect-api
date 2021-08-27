import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateSchoolDto {
    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Name cannot be empty'})
    name: string;

    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Address cannot be empty'})
    address: string;

    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'City cannot be empty'})
    city: string;

}
