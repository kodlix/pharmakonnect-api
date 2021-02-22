import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class FilterDto {

    @IsOptional()
    @IsNotEmpty()
    @ApiProperty()
    search: string;
}