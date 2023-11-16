import {
  IsBoolean,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  IsObject,
} from 'class-validator';

export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  correctAnswer?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  choices?: string[];

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
