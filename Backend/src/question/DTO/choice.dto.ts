import { IsNumber, IsString } from 'class-validator';

export class ChoiceDto {
  @IsNumber()
  id: number;

  @IsString()
  content: string;
}
