
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSectorDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;
}
