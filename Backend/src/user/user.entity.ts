import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number; // ID

  @Column()
  username: string; // Pseudo

  @Column()
  email: string; // Mail

  @Column()
  password: string; // MDP a cyrypter

  @Column({ default: 0 })
  bestScore: number; // Meilleur score

  @Column({ default: 0 })
  privilegeLevel: number; // Niveaux de privilèges
}
