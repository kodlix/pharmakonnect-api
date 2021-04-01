/* eslint-disable prettier/prettier */
import { PartialType } from "@nestjs/swagger";
import { CreateFeatureDto } from "./createfeature.dto";

export class UpdateFeatureDto extends PartialType(CreateFeatureDto) {}
