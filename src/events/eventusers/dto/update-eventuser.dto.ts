import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"


export class UpdateEventUserRegistrationDto {


    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Name cannot be empty'})
    name: string;

    @IsString()
    @IsNotEmpty({message: 'Email cannot be empty'})
    @IsEmail()
    @ApiProperty()
    readonly email: string;

    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Event ID cannot be empty'})
    eventId: string;  
   
    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Phone Number cannot be empty'})
    phoneNumber: string;

    @Expose()
    @IsString()
    @ApiPropertyOptional()
    @IsOptional()
    accessCode: string;

    @ApiProperty({default: false})
    @ApiPropertyOptional()
    @IsOptional()
    paid: boolean

}
