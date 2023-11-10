import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: "L'adresse email doit être un email valide" })
  email: string;

  @IsString({
    message: "Le nom d'utilisateur doit être une chaîne de caractères",
  })
  @Length(4, 20, {
    message: "Le nom d'utilisateur doit contenir entre 4 et 20 caractères",
  })
  username: string;

  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @Matches(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})/, {
    message:
      'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et être long de 8 à 30 caractères',
  })
  password: string;
}
