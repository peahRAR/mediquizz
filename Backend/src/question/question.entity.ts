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

  @Column({ nullable: true })
  correctAnswer: string; // La bonne réponse (pour les questions à réponse courte)

  @Column({ type: 'simple-array', nullable: true })
  choices: string[]; // Les choix pour les questions à choix multiples

  @Column({ default: false })
  isMultipleChoice: boolean; // Indique si la question est à choix multiples ou non

  @ManyToOne(() => Category, (category) => category.questions)
  @JoinColumn({ name: 'categoryId' })
  category: Category; // Categorie de la question
}
