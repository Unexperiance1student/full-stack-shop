import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Vlad' })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ example: 'qwq12e' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'user@mail.ru' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
