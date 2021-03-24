import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreatePollUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: "user's name is required" })
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'phonenumber is required' })
  phonumber: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pollId: string;

  
}
