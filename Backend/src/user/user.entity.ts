import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number; // ID

  @Column()
  username: string; // Pseudo

  @Column('json', { nullable: true }) // Mail
  email: {
    mailIdentifier: string;
    mailData: string;
  };

  @Column()
  password: string; // MDP a cyrypter

  @Column({ default: 0 })
  bestScore: number; // Meilleur score

  @Column({ default: 0 })
  privilegeLevel: number; // Niveaux de privilèges
}
