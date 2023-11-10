// user.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CreateUserDto } from './create-user.dto';

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

  private createMailIdentifier(email: string): string {
    // Mail Identifier permet de crypter l'e-mail de maniere unidirectionnel
    const secretKey = this.configService.get<string>('PASSWORDMAIL');
    return crypto.createHmac('sha256', secretKey).update(email).digest('hex');
  }

  private createMailData(email: string): string {
    const secret = this.configService.get<string>('ENCRYPTION_KEY');
    if (!secret) {
      throw new Error('Secret key is not defined in the configuration.');
    }

    // Générer une clé de 32 octets à partir de la phrase secrète
    const key = crypto.scryptSync(secret, 'salt', 32);

    // Générer un IV aléatoire
    const iv = crypto.randomBytes(16); // IV doit être de 16 octets pour AES-256

    // Créer et utiliser le chiffreur
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(email, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted; // Retour IV + email chiffré
  }

  // CREATE
  async create(userData: CreateUserDto): Promise<User> {
    // Créer le mailIdentifier
    const mailIdentifier = this.createMailIdentifier(userData.email);

    // Vérifier si un utilisateur avec le même mailIdentifier existe déjà
    const checkEmail = await this.userRepository
      .createQueryBuilder('user')
      .where("user.email ->> 'mailIdentifier' = :mailIdentifier", {
        mailIdentifier,
      })
      .getOne();

    if (checkEmail) {
      throw new ConflictException(
        'Un utilisateur avec cet e-mail existe déjà.',
      );
    }

    // Vérifier si le nom d'utilisateur est déjà utilisé
    const existingUser = await this.findOneByUsername(userData.username);
    if (existingUser) {
      throw new ConflictException("Nom d'utilisateur déjà utilisé");
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Créer le nouvel utilisateur
    const newUser = this.userRepository.create({
      username: userData.username,
      password: hashedPassword,
      email: {
        mailIdentifier: mailIdentifier,
        mailData: this.createMailData(userData.email), // Supposons que userData.email est l'adresse e-mail brute
      },
      bestScore: 0,
      privilegeLevel: 0,
    });

    // Sauvegarder l'utilisateur dans la base de données
    return this.userRepository.save(newUser);
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
