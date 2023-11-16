import {
  IsBoolean,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  IsObject,
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

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsNumber()
  level: number;

  @IsObject()
  category: { id: number };
}
