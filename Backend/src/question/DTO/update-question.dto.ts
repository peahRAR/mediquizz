import {
  IsBoolean,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
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

  @IsNumber()
  level: number;
}
