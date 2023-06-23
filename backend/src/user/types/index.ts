import { ApiProperty } from '@nestjs/swagger';

export class LoginUserRequest {
  @ApiProperty({ example: 'Vlad' })
  username: string;

  @ApiProperty({ example: 'qwq12e' })
  password: string;
}

export class LoginUserResponse {
  @ApiProperty({
    example: {
      user: {
        userId: 1,
        username: 'Vlad',
        email: 'user@mail.ru',
      },
    },
  })
  user: {
    userId: number;
    username: string;
    email: string;
  };

  @ApiProperty({ example: 'logged' })
  msg: string;
}

export class LogoutUserResponse {
  @ApiProperty({ example: 'session has ended' })
  msg: string;
}

export class LoginCheckResponse {
  @ApiProperty({ example: 'Vlad' })
  username: string;

  @ApiProperty({ example: '1' })
  userId: string;

  @ApiProperty({ example: 'user@mail.ru' })
  email: string;
}

export class SignUpResponse {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'Vlad' })
  username: string;

  @ApiProperty({
    example: '$2b$10$0dECUo8nLjvUQ3jzp2aqZ.l5OoT8EcCHRxprzyt/CNQJHOycuDmoS',
  })
  password: string;

  @ApiProperty({ example: 'user@mail.ru' })
  email: string;

  @ApiProperty({ example: '2023-06-21T22:04:32.925Z' })
  updatedAt: string;

  @ApiProperty({ example: '2023-06-21T22:04:32.925Z' })
  createdAt: string;
}
