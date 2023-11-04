import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Question } from './question.entity';

@Entity()
export class UserResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User; // L'utilisateur qui a donné la réponse

  @ManyToOne(() => Question)
  question: Question; // La question à laquelle la réponse a été donnée

  @Column()
  givenAnswer: string; // La réponse donnée par l'utilisateur

  @Column()
  isCorrect: boolean; // Si la réponse est correcte ou non

  @Column('double precision')
  responseTime: number; // Le temps pris par l'utilisateur pour répondre, en secondes
}
