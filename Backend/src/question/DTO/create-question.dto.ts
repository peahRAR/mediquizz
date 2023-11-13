import {
  IsBoolean,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  content: string;

  @IsString()
  correctAnswer?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  choices?: string[];

  @IsBoolean()
  isMultipleChoice: boolean;

  @IsNumber()
  level: number;
}
