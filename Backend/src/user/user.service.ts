// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  // CREATE
  async create(user: User): Promise<User> {
    const saltRounds = 10; // Nombre de tour de hachage
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword; // Stocker le mot de passe haché
    return this.userRepository.save(user);
  }

  // READ ALL
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // READ ONE
  async findOne(id: number): Promise<User> {
    const options: FindOneOptions<User> = {
      where: { id },
    };
    return this.userRepository.findOne(options);
  }

  // VERIFICATION PASSWORD
  async verifyPassword(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      return null; // L'utilisateur n'existe pas
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null; // Le mot de passe est incorrect
    }
    return user; // Retournez l'utilisateur si le mot de passe est valide
  }

  // READ ONE USER BY USERNAME
  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  // UPDATE
  async update(id: number, user: User): Promise<UpdateResult> {
    return this.userRepository.update(id, user);
  }

  // DELETE
  async remove(id: number): Promise<void> {
    this.userRepository.delete(id);
  }
}
