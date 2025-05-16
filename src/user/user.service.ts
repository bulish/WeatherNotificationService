import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { User } from './entity/user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { ICrudService } from 'src/common/interfaces/crud-service.interface';

@Injectable()
export class UserService implements Omit<ICrudService<User, RegisterDto>, 'create'> {

	constructor(private readonly userRepository: UserRepository) {}

	async getAll(): Promise<User[]> {
		return this.userRepository.getAll();
	}

	async getById(id: number): Promise<User | null> {
		return this.userRepository.findUserById(id);
	}

	async update(id: number, user: RegisterDto): Promise<User | null> {
		return this.userRepository.updateUser(id, user);
	}

	async delete(id: number): Promise<void> {
		return this.userRepository.removeUser(id);
	}
}
