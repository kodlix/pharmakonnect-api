import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";
import { CreateAdvertDto } from "./create-advert";

export class UpdateAdvertDto extends CreateAdvertDto{
    
}

export class ApproveAdvertDto {


}

export class RejectAdvertDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    rejectionMessage: string;
}