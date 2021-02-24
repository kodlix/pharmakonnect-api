import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, isValidationOptions, IsIn, IsEnum } from "class-validator";
import { accountTypes } from "../account.constant";

export class RegisterDTO {
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
    @IsEnum(accountTypes, {message: "Account type can either be 'Individual' or 'Corporate'"})
    readonly accountType: string;

    isRegComplete: boolean;
}

export class LoginDTO {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    readonly email: string;
    @IsNotEmpty()
    @ApiProperty()
    readonly password: string;
}

export class LockUserDTO {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    readonly email: string;
    @IsNotEmpty()
    @ApiProperty()
    readonly isLocked: boolean;
}
