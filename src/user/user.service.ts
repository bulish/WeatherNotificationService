import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { User } from './entity/user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UserService {

	constructor(private userRepository: UserRepository) { }

	async getAllUsers(): Promise<User[]> {
		return this.userRepository.getAll();
	}

	async getById(id: number) {
		return this.userRepository.findUserById(id);
	}

	async deleteUser(id: number) {
		return this.userRepository.removeUser(id);
	}

	async updateUser(id: number, user: RegisterDto) {
		return this.userRepository.updateUser(id, user);
	}

}
