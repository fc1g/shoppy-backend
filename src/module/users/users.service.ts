import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entity/User.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersPaginationDto } from './dtos/users-pagination.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findOneById(id: number): Promise<User> {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id: ${id} doesn't exist`);
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.repo.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email: ${email} doesn't exist`);
    }

    return user;
  }

  async find({ skip, limit }: UsersPaginationDto): Promise<User[]> {
    const users = await this.repo.find({
      take: limit,
      skip,
    });

    return users;
  }

  async create({ email, password }: CreateUserDto): Promise<User> {
    const existingUser = await this.repo.findOneBy({ email });

    if (existingUser) {
      throw new BadRequestException(`User with email: ${email} already exist`);
    }

    const hashedPassword = await this.generateHashedPassword(password);
    const newUser = this.repo.create({
      email,
      password: hashedPassword,
    });

    return this.repo.save(newUser);
  }

  async update(id: number, userDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id);

    if (userDto.password) {
      userDto.password = await this.generateHashedPassword(userDto.password);
    }

    Object.assign(user, userDto);
    return this.repo.save(user);
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.findOneById(id);

    await this.repo.remove(user);
    return { message: `User with id ${id} was deleted` };
  }

  private async generateHashedPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
