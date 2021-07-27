import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class FilterDto {

    @ApiProperty()
    @ApiPropertyOptional()
    search: string;

    @ApiProperty()
    @ApiPropertyOptional()
    page: number;

    @ApiProperty()
    @ApiPropertyOptional()
    take: number;
}