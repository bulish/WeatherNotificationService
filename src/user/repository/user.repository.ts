import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {  }

  async createUser(username: string, firstName: string, lastName: string, email: string, password: string,): Promise<User> {
    const user = this.userRepository.create({ username, password, firstName, lastName, email });
    return this.userRepository.save(user);
  }

  async findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id }  });
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    console.log('UPDATING USER ID:', id);
    console.log('UPDATES:', updates);

    const result = await this.userRepository.update(id, updates);
    console.log('UPDATE RESULT:', result);

    return this.userRepository.findOne({ where: { id } });
  }

  async removeUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'username', 'email', 'firstName', 'lastName']
    });
  }
}
