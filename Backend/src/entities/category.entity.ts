import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Le nom de la catégorie

  @OneToMany(() => Question, (question) => question.category)
  questions: Question[]; // Liste des questions associées à la catégorie
}
