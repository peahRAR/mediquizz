// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, UpdateResult } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  // CREATE
  async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  // READ ALL
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // READ ONE
  async findOne(id: number): Promise<User> {
    const options: FindOneOptions<User> = {
      where: { id },
    };
    return await this.userRepository.findOne(options);
  }

  // UPDATE
  async update(id: number, user: User): Promise<UpdateResult> {
    return await this.userRepository.update(id, user);
  }

  // DELETE
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
