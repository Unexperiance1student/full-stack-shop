import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entity/user.modal';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userRep: typeof User) {}

  async hashPassword(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, 10);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(filter: {
    where: {
      id?: string;
      username?: string;
      email?: string;
    };
  }): Promise<User> {
    return this.userRep.findOne({ ...filter });
  }

  async create(dto: CreateUserDto): Promise<User | { warningMessage: string }> {
    console.log(dto);
    const existingByUsername = await this.findOne({
      where: { username: dto.username },
    });
    const existingByEmail = await this.findOne({
      where: { email: dto.email },
    });

    if (existingByUsername) {
      return { warningMessage: 'Пользователь с таким именем уже существует' };
    }

    if (existingByEmail) {
      return { warningMessage: 'Пользователь с таким email уже существует' };
    }

    dto.password = await this.hashPassword(dto.password);
    const newUser = {
      username: dto.username,
      email: dto.email,
      password: dto.password,
    };

    return this.userRep.create(newUser);
  }
}
