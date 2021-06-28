import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Matches, MinLength, IsEnum, IsOptional } from "class-validator";
import { accountTypes } from "../account.constant";

export class RegisterDTO {
    @IsNotEmpty() @IsEmail() @ApiProperty() readonly email: string;
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    @IsNotEmpty() @MinLength(8) @ApiProperty() readonly password: string;
    @IsEnum(accountTypes, { message: "Account type can either be 'Individual' or 'Corporate'" })
    @IsNotEmpty() @ApiProperty()
    readonly accountType: string;
    @IsOptional() @ApiProperty()
    readonly firstName?: string;
    @IsOptional() @ApiProperty()
    readonly lastName?: string;
    @IsOptional() @ApiProperty()
    readonly organizationName?: string;
    @IsOptional() @ApiProperty()
    readonly organizationId?: string;
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
    @IsEmail() @IsNotEmpty({message: "Invalid email"}) @ApiProperty() readonly email: string;
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    @MinLength(8) @IsNotEmpty({message: "Password is required"}) @ApiProperty() readonly password: string;
    @IsNotEmpty({message: "Invalid token"}) @ApiProperty() readonly token: string;
}

export class ChangePasswordDto {
    @IsEmail() @IsNotEmpty() @ApiProperty() readonly email: string;
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    @MinLength(8) @IsNotEmpty() @ApiProperty() readonly newPassword: string;
    @IsNotEmpty() @ApiProperty() readonly currentPassword: string;
}
