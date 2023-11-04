import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string; // Le titre du quiz

  @Column({ default: 30 })
  timer: number; // Le temps alloué pour répondre à chaque question, en secondes

  @Column({ default: 10 })
  numberOfQuestions: number; // Le nombre de questions par manche

  @Column('simple-array', { nullable: true })
  selectedCategories: Category[]; // Tableau de catégories sélectionnées

  @Column({ default: 1 })
  maxParticipants: number; // Nombre maximum de participants au quiz
}
