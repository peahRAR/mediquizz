import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  content: string; // Réponse de l'utilisateur

  @Column()
  correctAnswer: string; // La bonne réponse (pour les questions à réponse courte)

  @Column({ type: 'simple-array', nullable: true })
  choices: string[]; // Les choix pour les questions à choix multiples

  @Column({ default: false })
  isMultipleChoice: boolean; // Indique si la question est à choix multiples ou non

  @Column()
  level: number; // Indique le niveau de difficulté sur 10.

  @Column({ length: 500, nullable: true })
  explanation: string; // Champ d'explication sur la réponse à la question

  @ManyToOne(() => Category, (category) => category.questions)
  @JoinColumn({ name: 'categoryId' })
  category: Category; // Categorie de la question
}
