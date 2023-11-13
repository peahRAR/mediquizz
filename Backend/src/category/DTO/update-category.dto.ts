import { IsString, Length } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @Length(2, 100) // Longueur minimale et maximale pour le nom de la catégorie
  name: string;
}
