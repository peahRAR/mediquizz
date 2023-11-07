// user.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  private readonly salt: string;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    this.salt = this.configService.get<string>('SALT');
  }
  // CREATE
  async create(user: User): Promise<User> {
    // Vérifier si un utilisateur avec la même adresse e-mail existe déjà
    const checkEmail = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (checkEmail) {
      throw new ConflictException(
        'Un utilisateur avec cet e-mail existe déjà.',
      );
    }
    // Vérifier si le nom d'utilisateur est déjà utilisé
    const existingUser = await this.findOneByUsername(user.username);
    if (existingUser) {
      throw new ConflictException("Nom d'utilisateur déjà utilisé");
    }
    const saltRounds = 10; // Nombre de tour de hachage pour le mot de passe.
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword; // Stocker le mot de passe haché.

    // Chiffrer l'adresse e-mail
    const email = user.email;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.salt),
      iv,
    );
    let encryptedEmail = cipher.update(email, 'utf8', 'hex');
    encryptedEmail += cipher.final('hex');
    user.email = `${iv.toString('hex')}:${encryptedEmail}`;

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

  // DECRYPT EMAIL
  async decryptEmail(user: User): Promise<string> {
    const [iv, encryptedEmail] = user.email.split(':');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.salt),
      Buffer.from(iv, 'hex'),
    );
    let decryptedEmail = decipher.update(encryptedEmail, 'hex', 'utf8');
    decryptedEmail += decipher.final('utf8');
    return decryptedEmail;
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
