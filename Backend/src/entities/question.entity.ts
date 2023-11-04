import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Quiz } from './quiz.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  content: string;

  @Column({ nullable: true })
  correctAnswer: string; // La bonne réponse (pour les questions à réponse courte)

  @Column({ type: 'simple-array', nullable: true })
  choices: string[]; // Les choix pour les questions à choix multiples

  @Column({ default: false })
  isMultipleChoice: boolean; // Indique si la question est à choix multiples ou non

  @ManyToOne(() => Category, (category) => category.questions)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  @JoinColumn({ name: 'quizId' }) // Assurez-vous que la colonne s'appelle 'quizId'
  quiz: Quiz; // Quiz associé à la question
}
