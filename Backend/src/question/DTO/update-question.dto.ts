import {
  IsBoolean,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { ChoiceDto } from './choice.dto';
import { Type } from 'class-transformer';

export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  correctAnswer?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChoiceDto)
  @IsOptional()
  choices?: ChoiceDto[];

  @IsBoolean()
  @IsOptional()
  isMultipleChoice?: boolean;

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsNumber()
  level: number;

  @IsObject()
  category: { id: number };
}
