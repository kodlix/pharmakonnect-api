import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class RegisterDto {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    readonly email: string;
    @IsString()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    @IsNotEmpty()
    @ApiProperty()
    readonly password: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly accounType: string;
}

export class LoginDto {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    readonly email: string;
    @IsNotEmpty()
    @ApiProperty()
    readonly password: string;
}

