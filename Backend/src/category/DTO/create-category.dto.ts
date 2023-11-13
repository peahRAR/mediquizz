import { IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(2, 100) // Longueur minimale et maximale pour le nom de la catégorie
  name: string;
}
