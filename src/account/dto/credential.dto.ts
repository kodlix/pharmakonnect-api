import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Matches, MinLength, IsEnum } from "class-validator";
import { accountTypes } from "../account.constant";

export class RegisterDTO {
    @IsNotEmpty() @IsEmail() @ApiProperty() readonly email: string;
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    @IsNotEmpty() @MinLength(8) @ApiProperty() readonly password: string;
    @IsEnum(accountTypes, { message: "Account type can either be 'Individual' or 'Corporate'" })
    @IsNotEmpty() @ApiProperty()
    readonly accountType: string;
    isRegComplete: boolean;
}

export class LoginDTO {
    @IsNotEmpty() @IsEmail() @ApiProperty() readonly email: string;
    @IsNotEmpty() @ApiProperty() readonly password: string;
}

export class LockUserDTO {
    @IsNotEmpty() @IsEmail() @ApiProperty() readonly email: string;
    @IsNotEmpty() @ApiProperty() readonly isLocked: boolean;
}

export class ResetPasswordDto {
    @IsEmail() @IsNotEmpty() @ApiProperty() readonly email: string;
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    @MinLength(8) @IsNotEmpty() @ApiProperty() readonly newPassword: string;
}

export class ChangePasswordDto {
    @IsEmail() @IsNotEmpty() @ApiProperty() readonly email: string;
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    @MinLength(8) @IsNotEmpty() @ApiProperty() readonly newPassword: string;
    @IsNotEmpty() @ApiProperty() readonly currentPassword: string;
}
