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

export class CreateQuestionDto {
  @IsString()
  content: string;

  @IsString()
  correctAnswer?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChoiceDto)
  @IsOptional()
  choices?: ChoiceDto[];

  @IsBoolean()
  isMultipleChoice: boolean;

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsNumber()
  level: number;

  @IsObject()
  category: { id: number };
}
