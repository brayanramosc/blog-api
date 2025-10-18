import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.findUser(id);
    return user;
  }

  async findOneWithPosts(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user.posts;
  }

  async create(user: CreateUserDto) {
    try {
      const newUser = await this.usersRepository.save(user);
      return newUser;
    } catch {
      throw new BadRequestException('Error creating user');
    }
  }

  async update(id: number, changes: UpdateUserDto) {
    try {
      const user = await this.findUser(id);
      const updatedUser = this.usersRepository.merge(user, changes);
      return await this.usersRepository.save(updatedUser);
    } catch {
      throw new BadRequestException('Error updating user');
    }
  }

  async delete(id: number) {
    try {
      await this.usersRepository.delete(id);
      return { message: 'User deleted successfully' };
    } catch {
      throw new BadRequestException('Error deleting user');
    }
  }

  private async findUser(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
